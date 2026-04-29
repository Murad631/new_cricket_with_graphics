import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not, IsNull } from 'typeorm';
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
  ) { }

  async deliveryRecording(dto: any) {
    try {
      const state = await this.scoreboardService.getActiveState();
      if (!state) throw new BadRequestException("Active scoreboard state not found");

      const matchId = state.matchId;
      const inningsId = state.currentInningsId;
      if (!matchId || !inningsId) throw new BadRequestException("No active match/inning found");

      // Slot-based Identification (Fixed Slots)
      const slot1MSId = state.strikerSquadId;
      const slot2MSId = state.nonStrikerSquadId;
      const bowlerMSId = state.bowlerSquadId;

      const strikerIndex = state.striker_index ?? 1;
      const striker = strikerIndex === 1 ? slot1MSId : slot2MSId;
      const nonStriker = strikerIndex === 1 ? slot2MSId : slot1MSId;
      const bowler = bowlerMSId;

      if (!striker || !nonStriker || !bowler) {
        throw new BadRequestException("Active players (striker, non-striker, and bowler) must be set");
      }

      // --- 1. Fetch or Create Batting Stats ---
      let strikerBatting = await this.batting.findOne({ where: { inningsId, player_id: striker, status: 1 } });
      if (!strikerBatting) {
        strikerBatting = await this.batting.save(this.batting.create({
          matchId, inningsId, player_id: striker, runs: 0, balls: 0, fours: 0, sixes: 0, index: 1, status: 1
        }));
      }

      let nonStrikerBatting = await this.batting.findOne({ where: { inningsId, player_id: nonStriker, status: 1 } });
      if (!nonStrikerBatting) {
        nonStrikerBatting = await this.batting.save(this.batting.create({
          matchId, inningsId, player_id: nonStriker, runs: 0, balls: 0, fours: 0, sixes: 0, index: 2, status: 1
        }));
      }

      // --- 2. Delivery Logic ---
      // --- 2. Delivery Logic ---
      const rawRun = Number(dto.run ?? 0);
      const rawExtra = Number(dto.extraRun ?? dto.exrtaRun ?? 0);
      const kind = this.getDeliveryKind(dto.extraType);
      const isWicket = dto.iswicket === "W" || dto.iswicket === true;
      const isLegalBall = kind !== DeliveryKind.WIDE && kind !== DeliveryKind.NOBALL;

      let teamRunDelta = rawRun + rawExtra;
      let batsmanRunDelta = rawRun;
      let crossingRuns = rawRun; // Used for calculating strike rotation

      if (kind === DeliveryKind.NOBALL || kind === DeliveryKind.WIDE) {
        // Guarantee at least 1 penalty run for the team
        if (teamRunDelta === 0) teamRunDelta = 1;

        if (kind === DeliveryKind.WIDE) {
          batsmanRunDelta = 0; // Wides never give batsman runs
          if (rawExtra === 0 && rawRun > 0) crossingRuns = rawRun - 1;
        } else if (kind === DeliveryKind.NOBALL) {
          if (rawExtra === 0 && rawRun > 0) {
            batsmanRunDelta = rawRun - 1;
            crossingRuns = rawRun - 1;
          } else {
            batsmanRunDelta = rawExtra > 0 ? rawRun : 0;
            crossingRuns = rawRun;
          }
        }
      } else if (kind === DeliveryKind.BYE || kind === DeliveryKind.LEG_BYE) {
        batsmanRunDelta = 0; // Byes/LegByes never give batsman runs
        crossingRuns = rawRun;
      }

      let teamExtraDelta = 0;
      if (kind === DeliveryKind.WIDE || kind === DeliveryKind.NOBALL) {
        teamExtraDelta = teamRunDelta - batsmanRunDelta;
      } else if (kind === DeliveryKind.BYE || kind === DeliveryKind.LEG_BYE) {
        teamExtraDelta = teamRunDelta;
      }

      const bowlerRunDelta = (kind === DeliveryKind.BYE || kind === DeliveryKind.LEG_BYE) ? 0 : teamRunDelta;
      const bowlerExtraDelta = (kind === DeliveryKind.WIDE || kind === DeliveryKind.NOBALL) ? teamRunDelta - batsmanRunDelta : 0;
      const ballIndexDelta = isLegalBall ? 1 : 0;
      let bowlerWicketDelta = 0;

      const symbol = this.getBallSymbol(teamRunDelta, kind, isWicket);

      // --- 3. Handle Wicket ---
      let wicketInfo: any = null;
      if (isWicket) {
        const playerOutId = dto.wicketType === WicketType.RUN_OUT ? (dto.out_player === 2 ? nonStriker : striker) : striker;
        const outPlayerBatting = playerOutId === striker ? strikerBatting : nonStrikerBatting;
        
        wicketInfo = {
          playerOutId, outPlayer: playerOutId === slot1MSId ? 1 : 2, wicketType: dto.wicketType,
          runs: (outPlayerBatting.runs ?? 0) + (playerOutId === striker ? batsmanRunDelta : 0),
          balls: (outPlayerBatting.balls ?? 0) + (playerOutId === striker && isLegalBall ? 1 : 0),
        };

        await this.batting.update(wicketInfo.playerOutId, {
          status: 0,
          runs: (outPlayerBatting.runs ?? 0) + (playerOutId === striker ? batsmanRunDelta : 0),
          balls: (outPlayerBatting.balls ?? 0) + (playerOutId === striker && isLegalBall ? 1 : 0),
          fours: (outPlayerBatting.fours ?? 0) + (playerOutId === striker && batsmanRunDelta === 4 ? 1 : 0),
          sixes: (outPlayerBatting.sixes ?? 0) + (playerOutId === striker && batsmanRunDelta === 6 ? 1 : 0)
        });

        // Emit wicket_dismissal graphic
        const outSquad = await this.matchSquadRepo.findOne({ where: { id: wicketInfo.playerOutId } });
        const outPlayerInfo = outSquad ? await this.playerRepo.findOne({ where: { id: outSquad.playerId } }) : null;
        const bowlerSquad = await this.matchSquadRepo.findOne({ where: { id: bowler } });
        const bowlerPlayerInfo = bowlerSquad ? await this.playerRepo.findOne({ where: { id: bowlerSquad.playerId } }) : null;

        this.eventEmitter.emit('graphic_event', {
          type: 'show', graphic: 'wicket_dismissal',
          data: {
            firstName: outPlayerInfo?.firstName?.toUpperCase(),
            lastName: outPlayerInfo?.lastName?.toUpperCase(),
            runs: wicketInfo.runs, balls: wicketInfo.balls,
            fours: (outPlayerBatting.fours ?? 0) + (playerOutId === striker && batsmanRunDelta === 4 ? 1 : 0),
            sixes: (outPlayerBatting.sixes ?? 0) + (playerOutId === striker && batsmanRunDelta === 6 ? 1 : 0),
            strikeRate: wicketInfo.balls > 0 ? ((wicketInfo.runs / wicketInfo.balls) * 100).toFixed(1) : "0.0",
            wicketType: dto.wicketType,
            bowlerName: bowlerPlayerInfo?.lastName?.toUpperCase(),
            dotBalls: 0
          }
        });
      }

      // --- 4. Update Striker (if not out) ---
      if (!isWicket || wicketInfo.playerOutId !== striker) {
        await this.batting.update(strikerBatting.id, {
          runs: (strikerBatting.runs ?? 0) + batsmanRunDelta,
          balls: (strikerBatting.balls ?? 0) + (isLegalBall ? 1 : 0),
          fours: (strikerBatting.fours ?? 0) + (batsmanRunDelta === 4 ? 1 : 0),
          sixes: (strikerBatting.sixes ?? 0) + (batsmanRunDelta === 6 ? 1 : 0),
        });
      }

      // --- 5. Update Over Summary ---
      const lastOver = await this.overSummary.findOne({ 
        where: { matchId, inningsId }, 
        order: { overNumber: 'DESC' } 
      });

      let currentOver: any = null;

      // If the absolutely last over of the innings is active...
      if (lastOver && lastOver.status === 1) {
        if (lastOver.player_id === bowler) {
          // It belongs to the current bowler, so we continue it
          currentOver = lastOver;
          // Safety: If it already has 6+ legal balls but status was stuck at 1, force close it
          if ((currentOver.ball_index ?? 0) >= 6) {
            await this.overSummary.update(currentOver.id, { status: 0 });
            currentOver = null;
          }
        } else {
          // It belongs to a DIFFERENT bowler (e.g. bowling change mid-over, or old active over stuck)
          // Force close it so we can start a fresh over for the new bowler
          await this.overSummary.update(lastOver.id, { status: 0 });
        }
      }

      if (!currentOver) {
        // Safety cleanup: close ALL active overs for this innings just to be sure there's no DB junk
        await this.overSummary.update({ matchId, inningsId, status: 1 }, { status: 0 });

        currentOver = await this.overSummary.save(this.overSummary.create({
          matchId, 
          inningsId, 
          player_id: bowler, 
          overNumber: (lastOver?.overNumber ?? 0) + 1, 
          balls: [], 
          ball_index: 0, 
          runs: 0, 
          extra: 0, 
          wickets: 0, 
          status: 1
        }));
      }

      const updatedBallIndex = (currentOver.ball_index ?? 0) + ballIndexDelta;
      await this.overSummary.update(currentOver.id, {
        balls: [...(currentOver.balls ?? []), symbol], ball_index: updatedBallIndex,
        runs: (currentOver.runs ?? 0) + bowlerRunDelta, extra: (currentOver.extra ?? 0) + bowlerExtraDelta,
        wickets: (currentOver.wickets ?? 0) + bowlerWicketDelta, status: updatedBallIndex >= 6 ? 0 : 1,
      });

      // --- 6. Final State & Rotation ---
      const finalTeamRun = (state.total_run ?? 0) + teamRunDelta;
      const finalTeamWickets = (state.total_wickets ?? 0) + (isWicket ? 1 : 0);
      let nextStrikerIndex = strikerIndex;
      
      // Strike rotates when batsmen physically cross
      if (crossingRuns % 2 === 1) nextStrikerIndex = strikerIndex === 1 ? 2 : 1;
      
      const isOverEnd = updatedBallIndex >= 6;
      if (isOverEnd) nextStrikerIndex = nextStrikerIndex === 1 ? 2 : 1;

      await this.scoreboardService.update(1, {
        total_run: finalTeamRun, total_wickets: finalTeamWickets, total_extra: (state.total_extra ?? 0) + teamExtraDelta,
        currentOverNumber: isOverEnd ? currentOver.overNumber : currentOver.overNumber - 1,
        striker_index: nextStrikerIndex
      });

      // Clear bowler on over end using QueryBuilder (null assignment)
      if (isOverEnd) {
        await this.scoreboardService.clearBowler();
      }

      // --- 7. Graphics (fetch FRESH data after all updates) ---
      // Use status:1 to get only active batting records, order by id DESC to get latest
      const b1 = await this.batting.findOne({ where: { inningsId, player_id: slot1MSId, status: 1 }, order: { id: 'DESC' } });
      const b2 = await this.batting.findOne({ where: { inningsId, player_id: slot2MSId, status: 1 }, order: { id: 'DESC' } });
      const getP = async (msId) => {
        const ms = await this.matchSquadRepo.findOne({ where: { id: msId } });
        return ms ? await this.playerRepo.findOne({ where: { id: ms.playerId } }) : null;
      };
      const p1 = await getP(slot1MSId), p2 = await getP(slot2MSId), pb = await getP(bowler);

      const graphicData = {
        playersData: {
          striker: { id: slot1MSId, firstName: p1?.firstName, lastName: p1?.lastName, runs: b1?.runs ?? 0, balls: b1?.balls ?? 0, isStriker: nextStrikerIndex === 1 },
          nonStriker: { id: slot2MSId, firstName: p2?.firstName, lastName: p2?.lastName, runs: b2?.runs ?? 0, balls: b2?.balls ?? 0, isStriker: nextStrikerIndex === 2 },
          bowler: { id: bowler, firstName: pb?.firstName, lastName: pb?.lastName, total_balls: updatedBallIndex, over_state: [...(currentOver.balls ?? []), symbol] },
          striker_side: nextStrikerIndex
        },
        scoreboardData: {
          totalRun: finalTeamRun, totalWicket: finalTeamWickets,
          overs: isOverEnd ? currentOver.overNumber : (currentOver.overNumber - 1) + (updatedBallIndex / 10),
          player1_runs: b1?.runs ?? 0, player2_runs: b2?.runs ?? 0, onStrike: nextStrikerIndex,
          ball_state: [...(currentOver.balls ?? []), symbol], wicket: wicketInfo
        }
      };

      this.eventEmitter.emit('graphic_event', { type: 'show', graphic: 'scoreboard', data: graphicData });
      this.eventEmitter.emitAsync('scoreboard.updated', graphicData.scoreboardData);
      
      this.getReaminingOverAndRuns(matchId, finalTeamRun, currentOver.overNumber, updatedBallIndex, dto.message);
      return graphicData.scoreboardData;
    } catch (e) {
      console.error("deliveryRecording Error:", e);
      throw new BadRequestException(e.message);
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
    await this.deliveryRepo.query('SET FOREIGN_KEY_CHECKS = 0');
    await this.deliveryRepo.query('TRUNCATE TABLE deliveries');
    await this.deliveryRepo.query('TRUNCATE TABLE innings');
    await this.deliveryRepo.query('TRUNCATE TABLE match_batting');
    await this.deliveryRepo.query('TRUNCATE TABLE over_summary');
    await this.deliveryRepo.query('TRUNCATE TABLE wickets');
    await this.deliveryRepo.query('TRUNCATE TABLE scoreboard_state');
    await this.deliveryRepo.query('SET FOREIGN_KEY_CHECKS = 1');
    return { message: "All match tables truncated successfully" };
  }

  async getTimeline(matchId: number) {
    const innings = await this.inningsRepo.find({ where: { matchId } });
    const innIds = innings.map(i => i.id);
    if (innIds.length === 0) return [];
    return this.deliveryRepo.find({ where: { inningsId: In(innIds) }, order: { seq: 'ASC' } });
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
    } catch (e) {}
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
