import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ScoreboardState } from '../Entity/scoreboard_stat.entity';
import { Innings } from '../Entity/inning.entity';
import { MatchSquad } from '../Entity/squad.entity';
import { Match } from '../Entity/match.entity';
import { Wicket } from 'src/Entity/wicket.entity';
import { MatchBatting } from 'src/Entity/match_betting.entity';
import { OverSummary } from 'src/Entity/over_summary.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';


@Injectable()
export class ScoreboardService {
  constructor(
    @InjectRepository(ScoreboardState) private readonly stateRepo: Repository<ScoreboardState>,
    @InjectRepository(Innings) private readonly innRepo: Repository<Innings>,
    @InjectRepository(MatchSquad) private readonly squadRepo: Repository<MatchSquad>,
    @InjectRepository(Match) private readonly matchRepo: Repository<Match>,
    @InjectRepository(MatchBatting) private readonly matchBattingRepo: Repository<MatchBatting>,
    @InjectRepository(OverSummary) private readonly overSummaryRepo: Repository<OverSummary>,
    private readonly eventEmitter: EventEmitter2,


  ) { }

  async getOrCreate(matchId: number) {
    let st = await this.stateRepo.findOne({ where: { matchId } });
    return st;
  }


  async getInningDetails(matchId: number) {
    const getInning = await this.innRepo.findOne({ where: { matchId, isActive: true } });
    return getInning?.id;
  }

  async getState(matchId: number) {

    return this.getOrCreate(matchId);
  }

  async getActiveState() {
    return this.stateRepo.findOne({ where: { id: 1 } });
  }

  async setDefault() {
    await this.stateRepo
      .createQueryBuilder()
      .update()
      .set({
        currentInningsId: () => 'NULL',
        strikerSquadId: () => 'NULL',
        nonStrikerSquadId: () => 'NULL',
        bowlerSquadId: () => 'NULL',
        currentOverNumber: 0,
        total_run: 0,
        total_extra: 0,
        total_wickets: 0
      })
      .where("id = :id", { id: 1 })
      .execute();
  }


  async setState(matchId: number, data: any) {
    const match = await this.matchRepo.findOne({ where: { id: matchId } });
    if (!match) throw new BadRequestException('Invalid matchId');

    const st = await this.getOrCreate(matchId);

    // validate innings belongs to this match
    // if (data.currentInningsId !== undefined) {
    //   const innId = Number(data.currentInningsId);
    //   const inn = await this.innRepo.findOne({ where: { id: innId } });
    //   if (!inn || inn.matchId !== matchId) throw new BadRequestException('Invalid currentInningsId for this match');
    //   st.currentInningsId = innId;
    // }

    // // validate squad IDs belong to this match (optional but recommended)
    // const checkSquad = async (squadId: any, field: string) => {
    //   if (squadId === undefined || squadId === null) return;
    //   const sid = Number(squadId);
    //   const sq = await this.squadRepo.findOne({ where: { id: sid, matchId } });
    //   if (!sq) throw new BadRequestException(`Invalid ${field} (not in match squad)`);
    //   return sid;
    // };

    // if (data.strikerSquadId !== undefined) st.strikerSquadId = await checkSquad(data.strikerSquadId, 'strikerSquadId');
    // if (data.nonStrikerSquadId !== undefined) st.nonStrikerSquadId = await checkSquad(data.nonStrikerSquadId, 'nonStrikerSquadId');
    // if (data.bowlerSquadId !== undefined) st.bowlerSquadId = await checkSquad(data.bowlerSquadId, 'bowlerSquadId');

    // // reset over cache if you want
    // if (data.resetOver === true) {
    //   st.currentOverNumber = 0;
    //   st.currentOverEvents = [];
    // }

    // return this.stateRepo.save(st);
  }

  //  async updateOverSummary(matchId: number, ballType: string): Promise<void> {
  //   const state = await this.getState(matchId);
  //   if (!state) throw new BadRequestException('Scoreboard state not found');

  //   // Ensure currentOverEvents is initialized
  //   if (!state.currentOverEvents) {
  //     state.currentOverEvents = [];  // Initialize if undefined
  //   }

  //   // Update over number and events
  //   state.currentOverEvents.push(ballType); // E.g., "run", "wide", "no-ball", etc.

  //   // Increment the over number if necessary (only for legal balls)
  //   if (ballType !== 'WD' && ballType !== 'NB') {  // Ignore extra balls (wide, no-ball)
  //     state.currentOverNumber++;
  //   }

  //   // Save the updated state
  //   await this.stateRepo.save(state);
  // }


  async startInning(body: any) {
    try {
      const fetchInning = await this.innRepo.findOne({ where: { id: body.id } });
      if (!fetchInning) throw new NotFoundException('Innings not found');

      // 1. Deactivate all other innings for this match and activate the current one
      await this.innRepo.update({ matchId: fetchInning.matchId }, { isActive: false });
      await this.innRepo.update({ id: fetchInning.id }, { isActive: true });

      // 2. Manage the single-row scoreboard state (ID: 1)
      const findStateBoard = await this.stateRepo.findOne({ where: { id: 1 } });

      if (findStateBoard) {
        await this.stateRepo.update({ id: 1 }, {
          matchId: fetchInning.matchId,
          currentInningsId: fetchInning.id,
          total_run: 0,
          total_wickets: 0,
          total_extra: 0,
          currentOverNumber: 0,
          strikerSquadId: () => 'NULL',
          nonStrikerSquadId: () => 'NULL',
          bowlerSquadId: () => 'NULL',
          striker_index: 1
        });
      } else {
        const dataObject = this.stateRepo.create({
          id: 1,
          matchId: fetchInning.matchId,
          currentInningsId: fetchInning.id,
          total_run: 0,
          total_wickets: 0,
          total_extra: 0,
          currentOverNumber: 0,
          striker_index: 1
        });
        await this.stateRepo.save(dataObject);
      }

      return { message: `Inning No ${fetchInning.id} started for match ${fetchInning.matchId}` };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }



  // async setPlayers({ striker, nonStriker, bowler }: any) {
  //   try {
  //     await this.stateRepo.update(
  //       { id: 1 },
  //       {
  //         strikerSquadId: striker,
  //         nonStrikerSquadId: nonStriker,
  //         bowlerSquadId: bowler,
  //       }
  //     );


  //     const players = await this.stateRepo
  //       .createQueryBuilder('s')
  //       .innerJoin('players', 'p1', 's.strikerSquadId = p1.id')
  //       .innerJoin('players', 'p2', 's.nonStrikerSquadId = p2.id')
  //       .innerJoin('players', 'p3', 's.bowlerSquadId = p3.id')
  //       .select([
  //         'p1.id AS strikerId',
  //         'p2.id AS nonStrikerId',
  //         'p3.id AS bowlerId',
  //         'p1.first_name AS strikerFirstName',
  //         'p1.last_name AS strikerLastName',
  //         'p2.first_name AS nonStrikerFirstName',
  //         'p2.last_name AS nonStrikerLastName',
  //         'p3.first_name AS bowlerFirstName',
  //         'p3.last_name AS bowlerLastName',
  //         's.currentInningsId AS inningsId',
  //         's.matchId AS matchId',
  //       ])
  //       .where('s.id = :id', { id: 1 })
  //       .getRawOne();

  //        const fetchInning = await this.innRepo
  //         .createQueryBuilder('i')
  //         .innerJoin('teams', 'battingTeam', 'i.battingTeamId = battingTeam.id')
  //         .innerJoin('teams', 'bowlingTeam', 'i.bowlingTeamId = bowlingTeam.id')
  //         .select([
  //           'battingTeam.name AS batting_name',
  //           'battingTeam.shortName AS batting_short_name',
  //           'battingTeam.logo AS batting_logo',
  //           'bowlingTeam.name AS bowling_name',
  //           'bowlingTeam.shortName AS bowling_short_name',
  //           'bowlingTeam.logo AS bowling_logo',
  //         ])
  //         .where('i.id = :id', { id: players.inningsId })
  //         .getRawOne();

  //     if (!players) {
  //       return { message: 'Not Found' };
  //     }

  //     const activeBatsmen = await this.matchBattingRepo.find({
  //       where: {
  //         matchId: players.matchId,
  //         inningsId: players.inningsId,
  //         status: 1,
  //       },
  //     });

  //     const tasks: Promise<any>[] = [];

  //     for (const bat of activeBatsmen) {
  //       if (
  //         bat.player_id !== players.strikerId &&
  //         bat.player_id !== players.nonStrikerId
  //       ) {
  //         tasks.push(
  //           this.matchBattingRepo.update({ id: bat.id }, { status: 0 })
  //         );
  //       }
  //     }
  //     const strikerBat = activeBatsmen.find(
  //       (b) => b.player_id === players.strikerId
  //     );

  //     if (!strikerBat) {
  //       tasks.push(
  //         this.matchBattingRepo.save(
  //           this.matchBattingRepo.create({
  //             matchId: players.matchId,
  //             inningsId: players.inningsId,
  //             player_id: players.strikerId,
  //             balls: 0,
  //             runs: 0,
  //             index: 1,
  //             status: 1,
  //           })
  //         )
  //       );
  //     } else if (strikerBat.index !== 1) {
  //       tasks.push(
  //         this.matchBattingRepo.update(
  //           { id: strikerBat.id },
  //           { index: 1 }
  //         )
  //       );
  //     }
  //     const nonStrikerBat = activeBatsmen.find(
  //       (b) => b.player_id === players.nonStrikerId
  //     );

  //     if (!nonStrikerBat) {
  //       tasks.push(
  //         this.matchBattingRepo.save(
  //           this.matchBattingRepo.create({
  //             matchId: players.matchId,
  //             inningsId: players.inningsId,
  //             player_id: players.nonStrikerId,
  //             balls: 0,
  //             runs: 0,
  //             index: 2,
  //             status: 1,
  //           })
  //         )
  //       );
  //     } else if (nonStrikerBat.index !== 2) {
  //       tasks.push(
  //         this.matchBattingRepo.update(
  //           { id: nonStrikerBat.id },
  //           { index: 2 }
  //         )
  //       );
  //     }
  //     const overSummary = await this.overSummaryRepo.findOne({where:{player_id:players.bowlerId, status: 1}})
  //     await Promise.all(tasks);
  //     return {
  //       inning : fetchInning,
  //       striker: {
  //         id: players.strikerId,
  //         firstName: players.strikerFirstName,
  //         lastName: players.strikerLastName,
  //         runs : strikerBat?.runs ?? 0,
  //         balls : strikerBat?.balls ?? 0,
  //       },
  //       nonStriker: {
  //         id: players.nonStrikerId,
  //         firstName: players.nonStrikerFirstName,
  //         lastName: players.nonStrikerLastName,

  //         runs : nonStrikerBat?.runs ?? 0,
  //         balls : nonStrikerBat?.balls ?? 0,
  //       },
  //       bowler: {
  //         id: players.bowlerId,
  //         firstName: players.bowlerFirstName,
  //         lastName: players.bowlerLastName,
  //         total_balls : overSummary?.ball_index,
  //         over_state : overSummary?.balls
  //       },
  //       matchId: players.matchId,
  //       inningsId: players.inningsId,
  //     };
  //   } catch (error) {
  //     throw new Error('Error saving/updating players: ' + error.message);
  //   }
  // }
  async setPlayers({ striker, nonStriker, bowler }: any) {
    try {
      // 1️⃣ Ensure the scoreboard state exists
      const state = await this.stateRepo.findOne({ where: { id: 1 } });
      if (!state || !state.currentInningsId) {
        throw new BadRequestException(
          'Scoreboard state not initialized or no active inning. Start the inning first.'
        );
      }

      // 1.5️⃣ Validate players against batting/bowling teams
      const inning = await this.innRepo.findOne({ where: { id: state.currentInningsId } });
      if (!inning) {
        throw new BadRequestException('Active inning not found.');
      }

      const batTeam = Number(inning.battingTeamId);
      const bowlTeam = Number(inning.bowlingTeamId);

      if (striker) {
        const strikerSquad = await this.squadRepo.findOne({ where: { id: striker } });
        if (!strikerSquad) throw new BadRequestException('Striker not found in squad.');
        if (Number(strikerSquad.teamId) !== batTeam) {
          throw new BadRequestException(`Striker (team ${strikerSquad.teamId}) must belong to the active batting team (team ${batTeam}).`);
        }
        if (strikerSquad.status !== 'pending' && strikerSquad.status !== 'playing') {
          throw new BadRequestException(`Striker status is ${strikerSquad.status}. Only pending players can be set.`);
        }
      }

      if (nonStriker) {
        const nonStrikerSquad = await this.squadRepo.findOne({ where: { id: nonStriker } });
        if (!nonStrikerSquad) throw new BadRequestException('Non-striker not found in squad.');
        if (Number(nonStrikerSquad.teamId) !== batTeam) {
          throw new BadRequestException(`Non-striker (team ${nonStrikerSquad.teamId}) must belong to the active batting team (team ${batTeam}).`);
        }
        if (nonStrikerSquad.status !== 'pending' && nonStrikerSquad.status !== 'playing') {
          throw new BadRequestException(`Non-striker status is ${nonStrikerSquad.status}. Only pending players can be set.`);
        }
      }

      if (bowler) {
        const bowlerSquad = await this.squadRepo.findOne({ where: { id: bowler } });
        if (!bowlerSquad) throw new BadRequestException('Bowler not found in squad.');
        if (Number(bowlerSquad.teamId) !== bowlTeam) {
          throw new BadRequestException(`Bowler (team ${bowlerSquad.teamId}) must belong to the active bowling team (team ${bowlTeam}).`);
        }

        const player = await this.squadRepo.manager.getRepository('Player').findOne({ where: { id: bowlerSquad.playerId } }) as any;
        if (player.role !== 'BOWL' && player.role !== 'ALL_ROUNDER') {
          throw new BadRequestException('Only players with role BOWL or ALL_ROUNDER can be select for bowling.');
        }

        const lastOver = await this.overSummaryRepo.findOne({
          where: { matchId: state.matchId, inningsId: state.currentInningsId },
          order: { overNumber: 'DESC' }
        });

        if (lastOver && lastOver.status === 0 && Number(lastOver.player_id) === Number(bowler)) {
          throw new BadRequestException('Back-to-back overs by the same bowler are not allowed.');
        }
      }

      // 2️⃣ Prepare partial update object (do NOT reset striker_index, preserve rotation!)
      const updatePayload: any = {};
      if (striker !== undefined && striker !== null) {
        updatePayload.strikerSquadId = striker;
        await this.squadRepo.update(striker, { status: 'playing' });
      }
      if (nonStriker !== undefined && nonStriker !== null) {
        updatePayload.nonStrikerSquadId = nonStriker;
        await this.squadRepo.update(nonStriker, { status: 'playing' });
      }
      if (bowler !== undefined && bowler !== null) updatePayload.bowlerSquadId = bowler;

      await this.stateRepo.update({ id: 1 }, updatePayload);

      // Re-read state after update to get final IDs
      const updatedState = await this.stateRepo.findOne({ where: { id: 1 } });
      if (!updatedState) throw new BadRequestException('Failed to read scoreboard state after update.');
      const finalStriker = updatedState.strikerSquadId!;
      const finalNonStriker = updatedState.nonStrikerSquadId!;
      const finalBowler = updatedState.bowlerSquadId!;

      // 3️⃣ Fetch player names via MatchSquad -> Player
      const getPlayerInfo = async (msId: number) => {
        if (!msId) return null;
        const ms = await this.squadRepo.findOne({ where: { id: msId } });
        if (!ms) return null;
        const p = await this.squadRepo.manager.getRepository('Player').findOne({ where: { id: ms.playerId } }) as any;
        return p ? { id: msId, playerId: ms.playerId, firstName: p.firstName, lastName: p.lastName } : null;
      };

      const strikerInfo = await getPlayerInfo(finalStriker);
      const nonStrikerInfo = await getPlayerInfo(finalNonStriker);
      const bowlerInfo = await getPlayerInfo(finalBowler);

      // 4️⃣ Fetch inning details
      const fetchInning = await this.innRepo
        .createQueryBuilder('i')
        .innerJoin('teams', 'battingTeam', 'i.battingTeamId = battingTeam.id')
        .innerJoin('teams', 'bowlingTeam', 'i.bowlingTeamId = bowlingTeam.id')
        .select([
          'battingTeam.name AS batting_name',
          'battingTeam.shortName AS batting_short_name',
          'battingTeam.logo AS batting_logo',
          'battingTeam.primaryColor AS batting_primary_color',
          'battingTeam.secondaryColor AS batting_secondary_color',
          'bowlingTeam.name AS bowling_name',
          'bowlingTeam.shortName AS bowling_short_name',
          'bowlingTeam.logo AS bowling_logo',
          'bowlingTeam.primaryColor AS bowling_primary_color',
          'bowlingTeam.secondaryColor AS bowling_secondary_color',
        ])
        .where('i.id = :id', { id: updatedState.currentInningsId })
        .getRawOne();

      // 5️⃣ Manage batting records using MatchSquad IDs (player_id column stores MatchSquad.id)
      const activeBatsmen = await this.matchBattingRepo.find({
        where: {
          matchId: updatedState.matchId,
          inningsId: updatedState.currentInningsId,
          status: 1,
        },
      });

      const tasks: Promise<any>[] = [];

      // Deactivate batsmen who are no longer on crease
      for (const bat of activeBatsmen) {
        if (bat.player_id !== finalStriker && bat.player_id !== finalNonStriker) {
          tasks.push(this.matchBattingRepo.update({ id: bat.id }, { status: 0 }));
        }
      }

      // Ensure striker batting record exists (using MatchSquad ID)
      const strikerBat = activeBatsmen.find((b) => b.player_id === finalStriker);
      if (!strikerBat) {
        tasks.push(
          this.matchBattingRepo.save(
            this.matchBattingRepo.create({
              matchId: updatedState.matchId,
              inningsId: updatedState.currentInningsId,
              player_id: finalStriker,
              balls: 0, runs: 0, fours: 0, sixes: 0, index: 1, status: 1,
            })
          )
        );
      }

      // Ensure non-striker batting record exists (using MatchSquad ID)
      const nonStrikerBat = activeBatsmen.find((b) => b.player_id === finalNonStriker);
      if (!nonStrikerBat) {
        tasks.push(
          this.matchBattingRepo.save(
            this.matchBattingRepo.create({
              matchId: updatedState.matchId,
              inningsId: updatedState.currentInningsId,
              player_id: finalNonStriker,
              balls: 0, runs: 0, fours: 0, sixes: 0, index: 2, status: 1,
            })
          )
        );
      }

      // Fetch bowler over summary
      const overSummary = await this.overSummaryRepo.findOne({
        where: { player_id: finalBowler, status: 1 },
      });

      await Promise.all(tasks);

      // 6️⃣ Return structured data
      const responseData = {
        inning: fetchInning,
        striker: {
          id: finalStriker,
          firstName: strikerInfo?.firstName,
          lastName: strikerInfo?.lastName,
          runs: strikerBat?.runs ?? 0,
          balls: strikerBat?.balls ?? 0,
        },
        nonStriker: {
          id: finalNonStriker,
          firstName: nonStrikerInfo?.firstName,
          lastName: nonStrikerInfo?.lastName,
          runs: nonStrikerBat?.runs ?? 0,
          balls: nonStrikerBat?.balls ?? 0,
        },
        bowler: {
          id: finalBowler,
          firstName: bowlerInfo?.firstName,
          lastName: bowlerInfo?.lastName,
          total_balls: overSummary?.ball_index ?? 0,
          over_state: overSummary?.balls ?? [],
        },
        matchId: updatedState.matchId,
        inningsId: updatedState.currentInningsId,
      };

      const scoreboardData = {
        totalRun: updatedState.total_run,
        totalWicket: updatedState.total_wickets,
        overs: updatedState.currentOverNumber,
        player1_runs: responseData.striker.runs,
        player2_runs: responseData.nonStriker.runs,
        player1_ball: responseData.striker.balls,
        player2_ball: responseData.nonStriker.balls,
        ball_state: responseData.bowler.over_state || [],
        onStrike: updatedState.striker_index ?? 1
      };

      // 7️⃣ Trigger Graphics Scoreboard
      this.eventEmitter.emit('graphic_event', {
        type: 'show',
        graphic: 'scoreboard',
        data: {
          playersData: { ...responseData, striker_side: updatedState.striker_index ?? 1 },
          scoreboardData
        }
      });

      return responseData;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }




  async switchPlayers() {
    try {
      const state = await this.stateRepo.findOne({ where: { id: 1 } });
      if (!state) throw new Error("State not found");

      const newIndex = state.striker_index === 1 ? 2 : 1;
      await this.stateRepo.update({ id: 1 }, { striker_index: newIndex });

      return { message: "strike switched", onStrike: newIndex };
    }
    catch (error) {
      throw new Error('Error switching players: ' + error.message);
    }
  }

  async update(scoreboardId: number, payload: any) {
    await this.stateRepo.update(
      { id: scoreboardId },
      {
        ...payload,
      }
    );

    return this.stateRepo.findOne({
      where: { id: scoreboardId },
    });
  }

  async clearBowler() {
    await this.stateRepo
      .createQueryBuilder()
      .update()
      .set({ bowlerSquadId: () => 'NULL' })
      .where("id = :id", { id: 1 })
      .execute();
  }
}

