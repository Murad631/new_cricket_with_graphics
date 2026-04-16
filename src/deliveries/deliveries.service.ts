import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, IsNull, Not, Repository } from 'typeorm';
import { Delivery } from '../Entity/deliveries.entity';
import { Wicket } from '../Entity/wicket.entity';
import { ScoreboardService } from '../scoreboard/scoreboard.service';
import { DeliveryKind, OutEnd, WicketType } from '../Entity/enums';
import { OverSummary } from 'src/Entity/over_summary.entity';
import { MatchBatting } from 'src/Entity/match_betting.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Match } from '../Entity/match.entity';
import { Innings } from '../Entity/inning.entity';
import { stat } from 'fs';
import { promises } from 'dns';
import { Team } from 'src/Entity/team.entity';
@Injectable()
export class DeliveryService {
  playerGateway: any;
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepo: Repository<Delivery>,  // Injecting the Delivery repository

    @InjectRepository(Wicket)
    private readonly wicketRepo: Repository<Wicket>,  // Injecting the Wicket repository

    @InjectRepository(OverSummary)
    private readonly overSummary: Repository<OverSummary>,

    @InjectRepository(MatchBatting)
    private readonly batting: Repository<MatchBatting>,

    @InjectRepository(Delivery)
    private readonly delivery: Repository<Delivery>,

    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,


    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,


    @InjectRepository(Innings)
    private readonly inningsRepo: Repository<Innings>,

    private readonly eventEmitter: EventEmitter2,


    private readonly scoreboardService: ScoreboardService,  // ScoreboardService to update state
  ) { }


  async deliveryRecording(dto: any) {
    try {
      if (!dto.matchId) throw new BadRequestException("Match ID is required");

      const state = await this.scoreboardService.getOrCreate(dto.matchId);
      if (!state) throw new BadRequestException("Scoreboard state not found for this match");

      const matchId = state.matchId;
      const inningsId = state.currentInningsId;
      const striker = state.strikerSquadId;
      const nonStriker = state.nonStrikerSquadId;
      const bowler = state.bowlerSquadId;

      if (!inningsId) throw new BadRequestException("No active innings found for this match");
      if (!striker || !nonStriker || !bowler) {
        throw new BadRequestException("Active players (striker, non-striker, and bowler) must be set");
      }

      const battingSummary = await this.batting.findOne({
        where: { player_id: striker, inningsId: inningsId, status: 1 },
      });

      if (!battingSummary) throw new BadRequestException("Active batting summary not found for striker");
      let currentOver = await this.overSummary.findOne({
        where: {
          matchId,
          inningsId,
          player_id: bowler,
          status: 1,
        },
      });

      let overNumber = currentOver?.overNumber ? currentOver?.overNumber : 1;

      if (!currentOver) {
        const lastOver = await this.overSummary.findOne({
          where: {
            matchId,
            inningsId,
          },
          order: { overNumber: "DESC" },
        });
        overNumber = (lastOver?.overNumber ?? 0) + 1;
      }

      if (!currentOver) {
        currentOver = this.overSummary.create({
          matchId,
          inningsId,
          player_id: bowler,
          overNumber,
          balls: [],
          ball_index: 0,
          runs: 0,
          extra: 0,
          wickets: 0,
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await this.overSummary.save(currentOver);
      }

      // Now we ALWAYS have a valid row
      let OverBalls: any[] = currentOver.balls ?? [];
      let ballIndex = currentOver.ball_index ?? 0;
      let bowlerRuns = currentOver.runs ?? 0;
      let bowlerExtra = currentOver.extra ?? 0;
      let bowlerWickets = currentOver.wickets ?? 0;

      // Safety check
      if (ballIndex >= 6) {
        return { message: `Over ${overNumber} is already complete.` };
      }

      // ────────────────────────────────────────────────
      // 4. Process the delivery
      // ────────────────────────────────────────────────
      const run = Number(dto.run ?? 0);
      let isLegalBall = true;
      let kind: DeliveryKind = DeliveryKind.RUN;
      let wicketInfo: any = null;
      let battingUpdate: any = {};

      if (dto.extraType === "WD") kind = DeliveryKind.WIDE;
      else if (dto.extraType === "NB") kind = DeliveryKind.NOBALL;
      else if (dto.extraType === "B") kind = DeliveryKind.BYE;
      else if (dto.extraType === "LB") kind = DeliveryKind.LEG_BYE;
      else if (dto.iswicket === "W") kind = DeliveryKind.WICKET;

      let teamRun = state.total_run ?? 0;
      let teamExtra = state.total_extra ?? 0;
      let totalWickets = state.total_wickets ?? 0;
      let player1runs = 0;
      let player1balls = 0;
      let player2runs = 0;
      let player2balls = 0;
      // ─── Extras ─────────────────────────────────────
      if (kind === DeliveryKind.WIDE) {
        isLegalBall = false;
        const wideRuns = (dto.exrtaRun ?? 0) + 1;
        teamRun += wideRuns;
        teamExtra += wideRuns;
        bowlerRuns += wideRuns;
        bowlerExtra += wideRuns;
        const showValues = dto.exrtaRun == 0 ? 'WD' : `WD+${dto.exrtaRun}`
        OverBalls.push(showValues);
      } else if (kind === DeliveryKind.NOBALL) {
        isLegalBall = false;
        const nbRuns = (dto.exrtaRun ?? 0) + 1;
        teamRun += nbRuns;
        teamExtra += nbRuns;
        bowlerRuns += nbRuns;
        bowlerExtra += nbRuns;
        const showValues = dto.exrtaRun == 0 ? 'NB' : `NB+${dto.exrtaRun}`
        OverBalls.push(showValues);
      } else if (kind === DeliveryKind.BYE || kind === DeliveryKind.LEG_BYE) {
        const extraRuns = dto.exrtaRun ?? 0;
        teamRun += extraRuns;
        teamExtra += extraRuns;
        ballIndex += 1;
        const newKind = kind == DeliveryKind.BYE ? "B" : "LB";
        const showValues = dto.exrtaRun == 0 ? kind : `${newKind}+${extraRuns}`
        OverBalls.push(showValues);
        battingUpdate = { balls: (battingSummary.balls ?? 0) + 1 };
      }

      // ─── Wicket ─────────────────────────────────────
      else if (kind === DeliveryKind.WICKET) {
        totalWickets += 1;
        ballIndex += 1;

        // ─── Determine which player is out ─────────────────
        if (dto.wicketType === WicketType.RUN_OUT) {
          wicketInfo = {
            playerOutId: dto.out_player === 1 ? striker! : nonStriker!,
            outPlayer: dto.out_player,
            wicketType: dto.wicketType,
            runs: 0,
            balls: 0,
          };

          const outBatting = await this.batting.findOne({
            where: { player_id: wicketInfo.playerOutId, inningsId, status: 1 },
          });

          if (outBatting) {
            wicketInfo.runs = (outBatting.runs ?? 0) + run;
            wicketInfo.balls = (outBatting.balls ?? 0) + 1;
            await this.batting.update(
              { id: outBatting.id },
              {
                runs: wicketInfo.runs,
                balls: wicketInfo.balls,
                status: 0,
              }
            );
          }
        } else {
          // Normal wicket
          wicketInfo = {
            playerOutId: striker!,
            outPlayer: 1, // striker
            wicketType: dto.wicketType,
            runs: (battingSummary.runs ?? 0) + run,
            balls: (battingSummary.balls ?? 0) + 1,
          };
          bowlerWickets += 1;

          await this.batting.update(
            { id: battingSummary.id },
            {
              runs: wicketInfo.runs,
              balls: wicketInfo.balls,
              status: 0,
            }
          );
        }

        if (wicketInfo.outPlayer === 1) {
          player1runs = wicketInfo.runs;
          player1balls = wicketInfo.balls;
        } else {
          player2runs = wicketInfo.runs;
          player2balls = wicketInfo.balls;
        }

        OverBalls.push(dto.wicketType === WicketType.RUN_OUT ? "RO" : "W");
      }


      // ─── Normal runs ────────────────────────────────
      else {
        teamRun += run;
        bowlerRuns += run;
        ballIndex += 1;
        OverBalls.push(run);

        battingUpdate = {
          runs: (battingSummary.runs ?? 0) + run,
          balls: (battingSummary.balls ?? 0) + 1,
        };
      }

      // ────────────────────────────────────────────────
      // 5. Update on-strike batsman stats (if legal ball)
      // ────────────────────────────────────────────────
      if (isLegalBall) {
        const onStrikePlayer = await this.batting.findOne({
          where: { player_id: striker, status: 1 },
        });

        if (onStrikePlayer) {
          await this.batting.update(
            { id: onStrikePlayer.id },
            {
              runs: (onStrikePlayer.runs ?? 0) + run,
              balls: (onStrikePlayer.balls ?? 0) + 1,
            }
          );
        }
      }

      // ────────────────────────────────────────────────
      // 6. Build response scoreboard
      // ────────────────────────────────────────────────
      const overWithIndex = `${overNumber - 1}.${ballIndex}`;
      const [over, ball] = overWithIndex.split('.').map(Number);
      const normalizedOver =
        ball >= 6 ? over + 1 : over + ball / 10;

      const battingPlayers = await this.batting.find({ where: { status: 1 } });

      for (const fs of battingPlayers) {
        if (fs.index === 1) {
          // striker
          player1runs = fs.runs;
          player1balls = fs.balls;
        }
        else if (fs.index === 2) {
          // non-striker
          player2runs = fs.runs;
          player2balls = fs.balls;
        }
      }
      const scoreboard = {
        totalRun: teamRun,
        totalWicket: totalWickets,
        totalExtra: teamExtra,
        overs: normalizedOver,
        bowlerRuns,
        bowlerBalls: ballIndex,
        ball_state: OverBalls,
        player1_ball: player1balls,
        player1_runs: player1runs,
        player2_ball: player2balls,
        player2_runs: player2runs,
        wicket: wicketInfo,
        averageRunRate: 0,
        currentRunRate: 0,
        requiredRunRate: 0,
      };

      this.eventEmitter.emitAsync('scoreboard.updated', scoreboard);

      // i need to use here  this.playerGateway.updateScoreBoard(scoreboard); 
      // i need first i will emit the call the socket the all the data save and update beacuse i need to update realtime and fast 
      // ────────────────────────────────────────────────
      // 7. Save delivery record
      // ────────────────────────────────────────────────
      const lastDelivery = await this.delivery.findOne({
        where: { inningsId },
        order: { seq: "DESC" },
      });
      const seq = (lastDelivery?.seq ?? 0) + 1;

      const savedDelivery = await this.deliveryRepo.save({
        inningsId,
        seq,
        overNumber,
        ballIndex,
        kind,
        isLegal: isLegalBall,
        strikerSquadId: striker,
        nonStrikerSquadId: nonStriker,
        bowlerSquadId: bowler,
        runsOffBat: kind === DeliveryKind.RUN ? run : (kind === DeliveryKind.NOBALL ? run : 0),
        wideRuns: kind === DeliveryKind.WIDE ? (dto.exrtaRun ?? 0) + 1 : 0,
        noBallRuns: kind === DeliveryKind.NOBALL ? (dto.exrtaRun ?? 0) + 1 : 0,
        byeRuns: kind === DeliveryKind.BYE ? (dto.exrtaRun ?? 0) : 0,
        legByeRuns: kind === DeliveryKind.LEG_BYE ? (dto.exrtaRun ?? 0) : 0,
        penaltyRuns: 0,
        total_runs: teamRun - (state.total_run ?? 0),
        symbol: "",
        wicketId: wicketInfo?.playerOutId ?? undefined,
        isVoided: false,
      });

      // ────────────────────────────────────────────────
      // 8. Save wicket if applicable
      // ────────────────────────────────────────────────
      if (kind === DeliveryKind.WICKET && wicketInfo) {
        await this.wicketRepo.save({
          inningsId,
          type: dto.wicketType,
          outBatsmanSquadId: wicketInfo.playerOutId,
          creditedBowlerSquadId: bowler,
          fielder1SquadId: dto.fielder1SquadId ?? null,
          isBowlerWicket: dto.wicketType !== WicketType.RUN_OUT,
          outEnd: wicketInfo.outPlayer === 1 ? OutEnd.STRIKER : OutEnd.NON_STRIKER,
          causedByDeliverySeq: savedDelivery.id, // Linking to actual Delivery ID
        });
      }

      // ────────────────────────────────────────────────
      // 9. Update over summary (ALWAYS update — never insert again)
      // ────────────────────────────────────────────────
      await this.overSummary.update(
        { id: currentOver.id },
        {
          balls: OverBalls,
          ball_index: ballIndex,
          runs: bowlerRuns,
          extra: bowlerExtra,
          wickets: bowlerWickets,
          status: ballIndex >= 6 ? 0 : 1,
          updatedAt: new Date(),
        }
      );

      // ────────────────────────────────────────────────
      // 10. Update global scoreboard
      // ────────────────────────────────────────────────
      await this.scoreboardService.update(1, {
        total_run: teamRun,
        total_extra: teamExtra,
        total_wickets: totalWickets,
        currentOverNumber: overNumber,
      });

      this.getReaminingOverAndRuns(matchId, teamRun, overNumber, ballIndex, dto.message);

      return scoreboard;
    } catch (e) {
      console.error("deliveryRecording error:", e);
      if (e instanceof BadRequestException) throw e;
      throw new BadRequestException(e.message || "Internal server error during delivery");
    }
  }


  async getReaminingOverAndRuns(matchID: number, totalRuns: number, overs: number, index: number, showMessage: number) {

    console.log(totalRuns)
    const inningStates = await this.inningsRepo.find({
      where: { matchId: matchID },
    });

    const matchDetails = await this.matchRepo.findOne({
      where: { id: matchID },
    });

    if (!matchDetails) {
      throw new Error("Match not found");
    }
    const inningMessage = await Promise.all(
      inningStates.map(async (i: any) => {
        let total_Target_score = 0;
        let message = "";
        let remainBalls = 0;
        if (i.number === "FIRST" && i.endedAt != null) {
          total_Target_score = i.targetRuns - totalRuns;
          const totalBalls = matchDetails.oversLimit ? matchDetails.oversLimit * 6 : 0;
          const attemptBalls = ((overs - 1) * 6) + index;
          remainBalls = totalBalls - attemptBalls;
          const team = await this.teamRepo.findOne({ where: { id: i.bowlingTeamId } })
          message = `${team?.name} Required ${total_Target_score} runs in ${remainBalls} balls`;
          if (showMessage === 1) {
            this.eventEmitter.emitAsync('match_state_message', message);
          }
        }
        return message;
      })
    );

  }


  private buildSymbol(kind: DeliveryKind, dto: any): string {
    switch (kind) {
      case DeliveryKind.RUN:
        return String(dto.runsOffBat ?? 0);
      case DeliveryKind.WIDE:
        return 'WD';
      case DeliveryKind.NOBALL:
        return dto.runsOffBat ? `NB+${dto.runsOffBat}` : 'NB';
      case DeliveryKind.BYE:
        return `B${dto.extraRuns ?? 0}`;
      case DeliveryKind.LEG_BYE:
        return `LB${dto.extraRuns ?? 0}`;
      case DeliveryKind.PENALTY:
        return `P${dto.extraRuns ?? 0}`;
      default:
        return '';
    }
  }


  async getRunRates(matchId: number) {
    const state = await this.scoreboardService.getOrCreate(matchId);
    if (!state) throw new BadRequestException("Scoreboard state not found");

    if (!state.currentInningsId) {
      return {
        averageRunRate: 0,
        currentRunRate: 0,
        requiredRunRate: 0
      };
    }

    const match = await this.matchRepo.findOne({ where: { id: matchId } });
    const totalOvers = match?.oversLimit || 20;
    const totalBallsAllocated = totalOvers * 6;

    const legalBallsCount = await this.delivery.count({
      where: {
        inningsId: state.currentInningsId,
        isLegal: true
      }
    });


    const teamRuns = state.total_run ?? 0;
    let crr = 0;
    if (legalBallsCount > 0) {
      const oversDecimal = legalBallsCount / 6;
      crr = teamRuns / oversDecimal;
    }


    let rrr = 0;


    const inningState = await this.inningsRepo.findOne({
      where: {
        matchId: matchId,
        targetRuns: Not(IsNull()),
        endedAt: Not(IsNull())
      }
    });

    const targetRuns = inningState?.targetRuns ?? 0;
    const runsRemaining = targetRuns - teamRuns;
    const ballsRemaining = totalBallsAllocated - legalBallsCount;

    if (runsRemaining > 0 && ballsRemaining > 0) {
      rrr = (runsRemaining * 6) / ballsRemaining; // per over
    } else {
      rrr = 0;
    }


    return {
      averageRunRate: parseFloat(crr.toFixed(2)),
      currentRunRate: parseFloat(crr.toFixed(2)),
      requiredRunRate: parseFloat(rrr.toFixed(2))
    };
  }

  async inningEnd(matchId: number) {
    if (!matchId) throw new BadRequestException("Match ID is required to end innings");
    const state = await this.scoreboardService.getOrCreate(matchId);
    if (!state) throw new BadRequestException("Scoreboard state not found");

    const inningsId = state.currentInningsId;
    if (!inningsId) throw new BadRequestException("No active innings to end");

    const total_over = await this.overSummary.findOne({
      where: { matchId: state.matchId, inningsId },
      order: { overNumber: 'DESC' }
    });

    const completedOvers = total_over?.overNumber ?? 0;
    const ballsInOver = total_over?.ball_index ?? 0;
    const totalBalls = (completedOvers * 6) + ballsInOver;
    const oversDecimal = totalBalls / 6;

    await this.inningsRepo.update(
      { id: inningsId },
      {
        targetRuns: state.total_run,
        total_extra: state.total_extra,
        total_attempt_over: oversDecimal,
        isActive: false,
        endedAt: new Date()
      }
    );

    // reset state for this match
    await this.scoreboardService.update(state.id, {
      currentInningsId: null,
      strikerSquadId: null,
      nonStrikerSquadId: null,
      bowlerSquadId: null,
      currentOverNumber: 0,
      total_run: 0,
      total_extra: 0,
      total_wickets: 0
    });

    return { message: "Inning End Successfully", status: true };
  }


}
