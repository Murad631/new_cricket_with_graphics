import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not, IsNull, DataSource } from 'typeorm';
import { Delivery } from '../Entity/deliveries.entity';
import { Wicket } from '../Entity/wicket.entity';
import { ScoreboardService } from '../scoreboard/scoreboard.service';
import { DeliveryKind, OutEnd, WicketType } from '../Entity/enums';
import { OverSummary } from 'src/Entity/over_summary.entity';
import { MatchBatting } from 'src/Entity/match_betting.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Match } from '../Entity/match.entity';
import { Innings } from '../Entity/inning.entity';
import { Team } from 'src/Entity/team.entity';
import { MatchSquad } from 'src/Entity/squad.entity';
import { Player } from 'src/Entity/player.entity';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery) private readonly deliveryRepo: Repository<Delivery>,
    @InjectRepository(Wicket) private readonly wicketRepo: Repository<Wicket>,
    @InjectRepository(OverSummary) private readonly overSummary: Repository<OverSummary>,
    @InjectRepository(MatchBatting) private readonly batting: Repository<MatchBatting>,
    @InjectRepository(Match) private readonly matchRepo: Repository<Match>,
    @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
    @InjectRepository(Innings) private readonly inningsRepo: Repository<Innings>,
    @InjectRepository(MatchSquad) private readonly matchSquadRepo: Repository<MatchSquad>,
    @InjectRepository(Player) private readonly playerRepo: Repository<Player>,
    private readonly eventEmitter: EventEmitter2,
    private readonly scoreboardService: ScoreboardService,
    private dataSource: DataSource
  ) { }

  async deliveryRecording(dto: any) {
    try {
      const state = await this.scoreboardService.getActiveState();
      if (!state) throw new BadRequestException("Active scoreboard state not found");

      const matchId = state.matchId;
      const inningsId = state.currentInningsId;
      if (!matchId || !inningsId) throw new BadRequestException("No active match/inning found");

      const striker = (state.striker_index === 1 ? state.strikerSquadId : state.nonStrikerSquadId) as number;
      const nonStriker = (state.striker_index === 1 ? state.nonStrikerSquadId : state.strikerSquadId) as number;
      const bowler = state.bowlerSquadId as number;

      if (!striker || !nonStriker || !bowler) {
        throw new BadRequestException("Striker, Non-Striker, and Bowler must be set before recording a delivery");
      }

      // --- 1. Validations ---
      const isWicket = dto.iswicket === "W" || dto.iswicket === true;
      let playerOutId: number | null = null;
      if (isWicket) {
        playerOutId = dto.wicketType === WicketType.RUN_OUT ? Number(dto.out_player) : striker;

        // Validation: Player must be on the crease to be out
        if (playerOutId !== striker && playerOutId !== nonStriker) {
          throw new BadRequestException("The dismissed player is not currently at the crease.");
        }

        // Validation: No duplicate wickets for the same player in this innings
        const existingWicket = await this.wicketRepo.findOne({ where: { inningsId, outBatsmanSquadId: playerOutId } });
        if (existingWicket) {
          throw new BadRequestException("This player is already marked as out in this innings.");
        }
      }

      // Fetch Batting Stats
      let strikerBat = await this.batting.findOne({ where: { inningsId, player_id: striker, status: 1 } });
      let nonStrikerBat = await this.batting.findOne({ where: { inningsId, player_id: nonStriker, status: 1 } });

      if (!strikerBat || !nonStrikerBat) {
        throw new BadRequestException("Active batting records not found for the players at the crease.");
      }

      // --- 2. Delivery Logic (No DB writes yet) ---
      const rawRun = Number(dto.run ?? 0);
      const rawExtra = Number(dto.extraRun ?? dto.exrtaRun ?? 0);
      const physicalRuns = rawRun > 0 ? rawRun : rawExtra; // Safely get the runs sent in payload
      const hasPlayerAccount = dto.player_account == 1 || dto.player_account === true || dto.player_account === 'true';
      const kind = this.getDeliveryKind(dto.extraType);
      const isLegalBall = kind !== DeliveryKind.WIDE && kind !== DeliveryKind.NOBALL;

      let teamRunDelta = 0;
      let batsmanRunDelta = 0;
      let teamExtraDelta = 0;

      if (kind === DeliveryKind.WIDE) {
        teamRunDelta = physicalRuns + 1; // 1 penalty + runs ran
        batsmanRunDelta = hasPlayerAccount ? physicalRuns : 0; // Credit striker if player_account is provided
        teamExtraDelta = teamRunDelta - batsmanRunDelta; // Remaining are extras
      } else if (kind === DeliveryKind.NOBALL) {
        teamRunDelta = physicalRuns + 1; // 1 penalty + runs ran
        batsmanRunDelta = hasPlayerAccount ? physicalRuns : 0; // Credit striker if player_account is provided
        teamExtraDelta = teamRunDelta - batsmanRunDelta; // Remaining are extras
      } else if (kind === DeliveryKind.BYE || kind === DeliveryKind.LEG_BYE) {
        teamRunDelta = physicalRuns; // Just the runs ran, no default penalty
        batsmanRunDelta = 0; // Striker ALWAYS gets 0 runs
        teamExtraDelta = physicalRuns; // All are extras
      } else {
        teamRunDelta = physicalRuns; // Legal ball
        batsmanRunDelta = physicalRuns;
        teamExtraDelta = 0;
      }

      const bowlerRunDelta = (kind === DeliveryKind.BYE || kind === DeliveryKind.LEG_BYE) ? 0 : teamRunDelta;
      const bowlerExtraDelta = (kind === DeliveryKind.WIDE || kind === DeliveryKind.NOBALL) ? teamExtraDelta : 0;
      const ballIndexDelta = isLegalBall ? 1 : 0;
      let bowlerWicketDelta = 0;

      const symbol = this.getBallSymbol(teamRunDelta, kind, isWicket);

      // --- 3. Data Persistence (DB writes start here) ---
      let savedWicketId: number | undefined = undefined;
      let wicketInfo: any = null;

      if (isWicket && playerOutId) {
        const outPlayerBatting = playerOutId === striker ? strikerBat : nonStrikerBat;
        const isBowlerWicket = [WicketType.BOWLED, WicketType.CAUGHT, WicketType.LBW, WicketType.STUMPED, WicketType.HIT_WICKET].includes(dto.wicketType);
        if (isBowlerWicket) bowlerWicketDelta = 1;

        const wicket = await this.wicketRepo.save(this.wicketRepo.create({
          inningsId, type: dto.wicketType, outBatsmanSquadId: playerOutId,
          creditedBowlerSquadId: isBowlerWicket ? bowler : undefined,
          isBowlerWicket, teamScore: (state.total_run ?? 0) + teamRunDelta
        }));
        savedWicketId = wicket.id;

        await this.matchSquadRepo.update(playerOutId, { status: 'out' });
        await this.batting.update(outPlayerBatting.id, {
          status: 0,
          runs: outPlayerBatting.runs + (playerOutId === striker ? batsmanRunDelta : 0),
          balls: outPlayerBatting.balls + (playerOutId === striker && isLegalBall ? 1 : 0),
          fours: outPlayerBatting.fours + (playerOutId === striker && batsmanRunDelta === 4 ? 1 : 0),
          sixes: outPlayerBatting.sixes + (playerOutId === striker && batsmanRunDelta === 6 ? 1 : 0)
        });

        wicketInfo = {
          playerOutId, outPlayer: playerOutId === state.strikerSquadId ? 1 : 2, wicketType: dto.wicketType,
          runs: outPlayerBatting.runs + (playerOutId === striker ? batsmanRunDelta : 0),
          balls: outPlayerBatting.balls + (playerOutId === striker && isLegalBall ? 1 : 0)
        };

        // Emit Graphic
        const getP = async (id) => {
          const ms = await this.matchSquadRepo.findOne({ where: { id } });
          return ms ? await this.playerRepo.findOne({ where: { id: ms.playerId } }) : null;
        };
        const outPlayerInfo = await getP(playerOutId);
        const bowlerPlayerInfo = await getP(bowler);

        this.eventEmitter.emit('graphic_event', {
          type: 'show', graphic: 'wicket_dismissal',
          data: {
            firstName: outPlayerInfo?.firstName?.toUpperCase(), lastName: outPlayerInfo?.lastName?.toUpperCase(),
            runs: wicketInfo.runs, balls: wicketInfo.balls, fours: outPlayerBatting.fours + (playerOutId === striker && batsmanRunDelta === 4 ? 1 : 0),
            sixes: outPlayerBatting.sixes + (playerOutId === striker && batsmanRunDelta === 6 ? 1 : 0),
            strikeRate: wicketInfo.balls > 0 ? ((wicketInfo.runs / wicketInfo.balls) * 100).toFixed(1) : "0.0",
            wicketType: dto.wicketType, bowlerName: bowlerPlayerInfo?.lastName?.toUpperCase(), dotBalls: 0
          }
        });
      }

      // Update Striker (if still in)
      if (!isWicket || playerOutId !== striker) {
        await this.batting.update(strikerBat.id, {
          runs: strikerBat.runs + batsmanRunDelta,
          balls: strikerBat.balls + (isLegalBall ? 1 : 0),
          fours: strikerBat.fours + (batsmanRunDelta === 4 ? 1 : 0),
          sixes: strikerBat.sixes + (batsmanRunDelta === 6 ? 1 : 0),
        });
      }

      // Over Summary
      const lastOver = await this.overSummary.findOne({ where: { matchId, inningsId }, order: { overNumber: 'DESC' } });
      let currentOver: any = null;
      if (lastOver && lastOver.status === 1) {
        if (lastOver.player_id === bowler && (lastOver.ball_index ?? 0) < 6) currentOver = lastOver;
        else await this.overSummary.update(lastOver.id, { status: 0 });
      }

      if (!currentOver) {
        currentOver = await this.overSummary.save(this.overSummary.create({
          matchId, inningsId, player_id: bowler, overNumber: (lastOver?.overNumber ?? 0) + 1,
          balls: [], ball_index: 0, runs: 0, extra: 0, wickets: 0, status: 1
        }));
      }

      const updatedBallIndex = (currentOver.ball_index ?? 0) + ballIndexDelta;
      await this.overSummary.update(currentOver.id, {
        balls: [...(currentOver.balls ?? []), symbol], ball_index: updatedBallIndex,
        runs: (currentOver.runs ?? 0) + bowlerRunDelta, extra: (currentOver.extra ?? 0) + bowlerExtraDelta,
        wickets: (currentOver.wickets ?? 0) + bowlerWicketDelta, status: updatedBallIndex >= 6 ? 0 : 1
      });

      // Scoreboard State
      const finalTeamRun = (state.total_run ?? 0) + teamRunDelta;
      const finalTeamWickets = (state.total_wickets ?? 0) + (isWicket ? 1 : 0);
      const isOverEnd = updatedBallIndex >= 6;

      await this.scoreboardService.update(1, {
        total_run: finalTeamRun, total_wickets: finalTeamWickets, total_extra: (state.total_extra ?? 0) + teamExtraDelta,
        currentOverNumber: isOverEnd ? currentOver.overNumber : currentOver.overNumber - 1
      });

      // Delivery Record
      const lastDelivery = await this.deliveryRepo.findOne({
        where: { inningsId },
        order: { seq: 'DESC' }
      });
      const deliverySeq = (lastDelivery?.seq || 0) + 1;
      await this.deliveryRepo.save(this.deliveryRepo.create({
        inningsId, seq: deliverySeq, overNumber: currentOver.overNumber - 1, ballIndex: updatedBallIndex - 1,
        kind, isLegal: isLegalBall, strikerSquadId: striker, nonStrikerSquadId: nonStriker, bowlerSquadId: bowler,
        runsOffBat: batsmanRunDelta, total_runs: teamRunDelta, symbol, wicketId: savedWicketId,
        wideRuns: kind === DeliveryKind.WIDE ? teamExtraDelta : 0,
        noBallRuns: kind === DeliveryKind.NOBALL ? teamExtraDelta : 0,
        byeRuns: kind === DeliveryKind.BYE ? teamExtraDelta : 0,
        legByeRuns: kind === DeliveryKind.LEG_BYE ? teamExtraDelta : 0,
      }));

      if (isOverEnd) await this.scoreboardService.clearBowler();

      // Refresh data for Graphics
      const b1 = await this.batting.findOne({ where: { inningsId, player_id: state.strikerSquadId } });
      const b2 = await this.batting.findOne({ where: { inningsId, player_id: state.nonStrikerSquadId } });
      const getPInfo = async (id) => {
        const ms = await this.matchSquadRepo.findOne({ where: { id } });
        return ms ? await this.playerRepo.findOne({ where: { id: ms.playerId } }) : null;
      };
      const p1 = await getPInfo(state.strikerSquadId), p2 = await getPInfo(state.nonStrikerSquadId), pb = await getPInfo(bowler);

      const graphicData = {
        playersData: {
          striker: { id: state.strikerSquadId, firstName: p1?.firstName, lastName: p1?.lastName, runs: b1?.runs ?? 0, balls: b1?.balls ?? 0, isStriker: state.striker_index === 1, status: b1?.status ?? 1 },
          nonStriker: { id: state.nonStrikerSquadId, firstName: p2?.firstName, lastName: p2?.lastName, runs: b2?.runs ?? 0, balls: b2?.balls ?? 0, isStriker: state.striker_index === 2, status: b2?.status ?? 1 },
          bowler: { id: bowler, firstName: pb?.firstName, lastName: pb?.lastName, total_balls: updatedBallIndex, over_state: [...(currentOver.balls ?? []), symbol] },
          striker_side: state.striker_index
        },
        scoreboardData: {
          totalRun: finalTeamRun, totalWicket: finalTeamWickets, overs: isOverEnd ? currentOver.overNumber : (currentOver.overNumber - 1) + (updatedBallIndex / 10),
          player1_runs: b1?.runs ?? 0, player2_runs: b2?.runs ?? 0, onStrike: state.striker_index, ball_state: [...(currentOver.balls ?? []), symbol], wicket: wicketInfo
        }
      };

      this.eventEmitter.emit('graphic_event', { type: 'show', graphic: 'scoreboard', data: graphicData });
      this.eventEmitter.emitAsync('scoreboard.updated', graphicData.scoreboardData);
      this.getReaminingOverAndRuns(matchId, finalTeamRun, currentOver.overNumber, updatedBallIndex, dto.message);

      await this.autoStrikeRotation(physicalRuns, isOverEnd);

      return graphicData.scoreboardData;
    } catch (e) {
      console.error("deliveryRecording Error:", e);
      throw new BadRequestException(e.message);
    }
  }

  private async autoStrikeRotation(physicalRuns: number, isOverEnd: boolean) {
    let shouldSwap = false;

    // 1. First apply RUN rule
    // Odd runs rotate the strike, even runs do not
    if (physicalRuns % 2 !== 0) {
      shouldSwap = !shouldSwap;
    }

    // 2. THEN apply OVER END rule
    // Over end always forces an additional swap
    if (isOverEnd) {
      shouldSwap = !shouldSwap;
    }

    // If final result is true, we trigger the switch
    if (shouldSwap) {
      const result = await this.scoreboardService.switchPlayers();
      this.eventEmitter.emitAsync('switch-player', result);
    }
  }

  private getDeliveryKind(extraType: string): DeliveryKind {
    if (extraType === 'WD') return DeliveryKind.WIDE;
    if (extraType === 'NB') return DeliveryKind.NOBALL;
    if (extraType === 'B') return DeliveryKind.BYE;
    if (extraType === 'LB') return DeliveryKind.LEG_BYE;
    return DeliveryKind.RUN;
  }

  private getBallSymbol(run: number, kind: DeliveryKind, isWicket: boolean): string {
    if (isWicket) return 'W';
    if (kind === DeliveryKind.WIDE) return 'WD';
    if (kind === DeliveryKind.NOBALL) return 'NB';
    if (kind === DeliveryKind.BYE) return 'B';
    if (kind === DeliveryKind.LEG_BYE) return 'LB';
    return run.toString();
  }


  async cleanAll() {
    await this.dataSource.query(`SET FOREIGN_KEY_CHECKS = 0`);

    await this.dataSource.query(`TRUNCATE TABLE wickets`);
    await this.dataSource.query(`TRUNCATE TABLE deliveries`);
    await this.dataSource.query(`TRUNCATE TABLE match_batting`);
    await this.dataSource.query(`TRUNCATE TABLE over_summary`);

    await this.dataSource.query(`SET FOREIGN_KEY_CHECKS = 1`);
  }



  async getReaminingOverAndRuns(matchID: number, totalRuns: number, overs: number, index: number, showMessage: number) {
    try {
      const inningStates = await this.inningsRepo.find({ where: { matchId: matchID } });
      const matchDetails = await this.matchRepo.findOne({ where: { id: matchID } });
      if (!matchDetails) return;

      for (const i of inningStates) {
        if (i.number === "FIRST" && i.endedAt != null) {
          const target = i.targetRuns || 0;
          const diff = target - totalRuns;
          const totalBalls = (matchDetails.oversLimit || 20) * 6;
          const attemptBalls = (overs * 6) + index;
          const remain = totalBalls - attemptBalls;
          const team = await this.teamRepo.findOne({ where: { id: i.bowlingTeamId } });
          const message = `${team?.name} Required ${diff} runs in ${remain} balls`;
          if (showMessage === 1) this.eventEmitter.emitAsync('match_state_message', message);
        }
      }
    } catch (e) { }
  }

  async getRunRates(matchId: number) {
    const state = await this.scoreboardService.getOrCreate(matchId);
    if (!state || !state.currentInningsId) return { averageRunRate: 0, currentRunRate: 0, requiredRunRate: 0 };

    const match = await this.matchRepo.findOne({ where: { id: matchId } });
    const totalBallsAllocated = (match?.oversLimit || 20) * 6;

    const legalBallsCount = await this.deliveryRepo.count({ where: { inningsId: state.currentInningsId, isLegal: true } });
    const teamRuns = state.total_run ?? 0;

    let crr = legalBallsCount > 0 ? teamRuns / (legalBallsCount / 6) : 0;

    const inningState = await this.inningsRepo.findOne({ where: { matchId: matchId, targetRuns: Not(IsNull()), endedAt: Not(IsNull()) } });
    const targetRuns = inningState?.targetRuns ?? 0;
    const runsRemaining = targetRuns - teamRuns;
    const ballsRemaining = totalBallsAllocated - legalBallsCount;

    let rrr = (runsRemaining > 0 && ballsRemaining > 0) ? (runsRemaining * 6) / ballsRemaining : 0;

    return { averageRunRate: parseFloat(crr.toFixed(2)), currentRunRate: parseFloat(crr.toFixed(2)), requiredRunRate: parseFloat(rrr.toFixed(2)) };
  }

  async inningEnd(matchId: number) {
    const state = await this.scoreboardService.getOrCreate(matchId);
    if (!state || !state.currentInningsId) throw new BadRequestException("No active innings");

    const inningsId = state.currentInningsId;
    const total_over = await this.overSummary.findOne({ where: { matchId, inningsId }, order: { overNumber: 'DESC' } });
    const totalBalls = ((total_over?.overNumber ?? 0) * 6) + (total_over?.ball_index ?? 0);

    await this.inningsRepo.update({ id: inningsId }, { targetRuns: state.total_run, total_attempt_over: totalBalls / 6, isActive: false, endedAt: new Date() });
    await this.scoreboardService.update(state.id, { currentInningsId: null, strikerSquadId: null, nonStrikerSquadId: null, bowlerSquadId: null, currentOverNumber: 0, total_run: 0, total_extra: 0, total_wickets: 0 });

    return { message: "Inning End Successfully", status: true };
  }
}
