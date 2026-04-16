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

@Injectable()
export class ScoreboardService {
  constructor(
    @InjectRepository(ScoreboardState) private readonly stateRepo: Repository<ScoreboardState>,
    @InjectRepository(Innings) private readonly innRepo: Repository<Innings>,
    @InjectRepository(MatchSquad) private readonly squadRepo: Repository<MatchSquad>,
    @InjectRepository(Match) private readonly matchRepo: Repository<Match>,
    @InjectRepository(MatchBatting) private readonly matchBattingRepo: Repository<MatchBatting>,
    @InjectRepository(OverSummary) private readonly overSummaryRepo: Repository<OverSummary>,

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


      const findStateBoard = await this.stateRepo.findOne({ where: { id: 1 } });
      if (findStateBoard) {
        await this.stateRepo.update({ id: 1 }, {
          matchId: fetchInning.matchId,
          currentInningsId: fetchInning.id
        })
      }
      else {
        const dataObject = this.stateRepo.create({
          matchId: fetchInning.matchId,
          currentInningsId: fetchInning.id
        });
        const started = await this.stateRepo.save(dataObject);

      }

      await this.innRepo.update({ id: fetchInning.id }, { isActive: true })
      return { message: `Inning No ${fetchInning.id} started` };

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
      if (!state) {
        throw new BadRequestException(
          'Scoreboard state not initialized. Start the inning first.'
        );
      }

      // 2️⃣ Update the striker, non-striker, and bowler IDs
      await this.stateRepo.update(
        { id: 1 },
        {
          strikerSquadId: striker,
          nonStrikerSquadId: nonStriker,
          bowlerSquadId: bowler,
        }
      );

      // 3️⃣ Fetch players info using LEFT JOIN to avoid undefined results
      const players = await this.stateRepo
        .createQueryBuilder('s')
        .leftJoin('players', 'p1', 's.strikerSquadId = p1.id')
        .leftJoin('players', 'p2', 's.nonStrikerSquadId = p2.id')
        .leftJoin('players', 'p3', 's.bowlerSquadId = p3.id')
        .select([
          'p1.id AS strikerId',
          'p2.id AS nonStrikerId',
          'p3.id AS bowlerId',
          'p1.first_name AS strikerFirstName',
          'p1.last_name AS strikerLastName',
          'p2.first_name AS nonStrikerFirstName',
          'p2.last_name AS nonStrikerLastName',
          'p3.first_name AS bowlerFirstName',
          'p3.last_name AS bowlerLastName',
          's.currentInningsId AS inningsId',
          's.matchId AS matchId',
        ])
        .where('s.id = :id', { id: 1 })
        .getRawOne();

      // 4️⃣ Guard: ensure players object is valid
      if (!players || !players.inningsId) {
        throw new BadRequestException(
          'Players not found. Ensure striker, non-striker, bowler, and inning are set.'
        );
      }

      // 5️⃣ Fetch inning details
      const fetchInning = await this.innRepo
        .createQueryBuilder('i')
        .innerJoin('teams', 'battingTeam', 'i.battingTeamId = battingTeam.id')
        .innerJoin('teams', 'bowlingTeam', 'i.bowlingTeamId = bowlingTeam.id')
        .select([
          'battingTeam.name AS batting_name',
          'battingTeam.shortName AS batting_short_name',
          'battingTeam.logo AS batting_logo',
          'bowlingTeam.name AS bowling_name',
          'bowlingTeam.shortName AS bowling_short_name',
          'bowlingTeam.logo AS bowling_logo',
        ])
        .where('i.id = :id', { id: players.inningsId })
        .getRawOne();

      // 6️⃣ Fetch active batsmen for this inning
      const activeBatsmen = await this.matchBattingRepo.find({
        where: {
          matchId: players.matchId,
          inningsId: players.inningsId,
          status: 1,
        },
      });

      const tasks: Promise<any>[] = [];

      // 7️⃣ Deactivate batsmen who are no longer on crease
      for (const bat of activeBatsmen) {
        if (
          bat.player_id !== players.strikerId &&
          bat.player_id !== players.nonStrikerId
        ) {
          tasks.push(this.matchBattingRepo.update({ id: bat.id }, { status: 0 }));
        }
      }

      // 8️⃣ Ensure striker and non-striker records exist
      const strikerBat = activeBatsmen.find((b) => b.player_id === players.strikerId);
      if (!strikerBat) {
        tasks.push(
          this.matchBattingRepo.save(
            this.matchBattingRepo.create({
              matchId: players.matchId,
              inningsId: players.inningsId,
              player_id: players.strikerId,
              balls: 0,
              runs: 0,
              index: 1,
              status: 1,
            })
          )
        );
      } else if (strikerBat.index !== 1) {
        tasks.push(this.matchBattingRepo.update({ id: strikerBat.id }, { index: 1 }));
      }

      const nonStrikerBat = activeBatsmen.find((b) => b.player_id === players.nonStrikerId);
      if (!nonStrikerBat) {
        tasks.push(
          this.matchBattingRepo.save(
            this.matchBattingRepo.create({
              matchId: players.matchId,
              inningsId: players.inningsId,
              player_id: players.nonStrikerId,
              balls: 0,
              runs: 0,
              index: 2,
              status: 1,
            })
          )
        );
      } else if (nonStrikerBat.index !== 2) {
        tasks.push(this.matchBattingRepo.update({ id: nonStrikerBat.id }, { index: 2 }));
      }

      // 9️⃣ Fetch bowler over summary
      const overSummary = await this.overSummaryRepo.findOne({
        where: { player_id: players.bowlerId, status: 1 },
      });

      // 10️⃣ Execute all pending DB updates
      await Promise.all(tasks);

      // 11️⃣ Return structured data
      return {
        inning: fetchInning,
        striker: {
          id: players.strikerId,
          firstName: players.strikerFirstName,
          lastName: players.strikerLastName,
          runs: strikerBat?.runs ?? 0,
          balls: strikerBat?.balls ?? 0,
        },
        nonStriker: {
          id: players.nonStrikerId,
          firstName: players.nonStrikerFirstName,
          lastName: players.nonStrikerLastName,
          runs: nonStrikerBat?.runs ?? 0,
          balls: nonStrikerBat?.balls ?? 0,
        },
        bowler: {
          id: players.bowlerId,
          firstName: players.bowlerFirstName,
          lastName: players.bowlerLastName,
          total_balls: overSummary?.ball_index ?? 0,
          over_state: overSummary?.balls ?? 0,
        },
        matchId: players.matchId,
        inningsId: players.inningsId,
      };
    } catch (error) {
      throw new BadRequestException('Error saving/updating players: ' + error.message);
    }
  }




  async switchPlayers() {
    try {
      const existingStriker = await this.stateRepo.findOne({ where: { id: 1 } });
      const sticker = existingStriker?.strikerSquadId;
      const non_sticker = existingStriker?.nonStrikerSquadId;
      await this.stateRepo.update({ id: 1 }, { strikerSquadId: non_sticker, nonStrikerSquadId: sticker });
      return { message: "player switched" }
    }
    catch (error) {
      throw new Error('Error saving/updating players: ' + error.message);
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
}

