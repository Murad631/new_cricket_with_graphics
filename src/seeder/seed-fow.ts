import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../Entity/match.entity';
import { Innings } from '../Entity/inning.entity';
import { Wicket } from '../Entity/wicket.entity';
import { Delivery } from '../Entity/deliveries.entity';
import { MatchSquad } from '../Entity/squad.entity';
import { Team } from '../Entity/team.entity';
import { Player } from '../Entity/player.entity';
import { MatchFormat, MatchStatus, InningsNumber, WicketType, DeliveryKind } from '../Entity/enums';

@Injectable()
export class FowSeeder {
  constructor(
    @InjectRepository(Match) private matchRepo: Repository<Match>,
    @InjectRepository(Innings) private inningsRepo: Repository<Innings>,
    @InjectRepository(Wicket) private wicketRepo: Repository<Wicket>,
    @InjectRepository(Delivery) private deliveryRepo: Repository<Delivery>,
    @InjectRepository(MatchSquad) private squadRepo: Repository<MatchSquad>,
    @InjectRepository(Team) private teamRepo: Repository<Team>,
    @InjectRepository(Player) private playerRepo: Repository<Player>,
  ) {}

  async seed() {
    // 0. Find existing teams and players to make seed valid
    const teams = await this.teamRepo.find({ take: 2 });
    if (teams.length < 2) return { status: 'error', message: 'Need at least 2 teams in DB to seed' };

    const players1 = await this.playerRepo.find({ where: { teamId: teams[0].id }, take: 11 });
    const players2 = await this.playerRepo.find({ where: { teamId: teams[1].id }, take: 11 });

    if (players1.length < 3 || players2.length < 1) {
        return { status: 'error', message: 'Not enough players for teams' };
    }

    // 1. Create a historical match (Match ID 5 or similar)
    const match = await this.matchRepo.save({
      title: `${teams[0].name} vs ${teams[1].name} - Historic`,
      format: MatchFormat.T20,
      team1Id: teams[0].id,
      team2Id: teams[1].id,
      status: MatchStatus.FINISHED,
      venue: 'Dubai International Stadium',
    });

    // 2. Create MatchSquad entries
    const squadEntries1 = await Promise.all(players1.map(p => 
        this.squadRepo.save({ matchId: match.id, teamId: teams[0].id, playerId: p.id, isPlayingXI: true, isActive: true })
    ));
    const squadEntries2 = await Promise.all(players2.map(p => 
        this.squadRepo.save({ matchId: match.id, teamId: teams[1].id, playerId: p.id, isPlayingXI: true, isActive: true })
    ));

    // 3. Create Innings for Team 1
    const innings = await this.inningsRepo.save({
      matchId: match.id,
      battingTeamId: teams[0].id,
      bowlingTeamId: teams[1].id,
      number: InningsNumber.FIRST,
      isActive: false,
    });

    // 4. Create Wickets and Deliveries
    const fowData = [
      { wicket: 1, score: 32, over: 4, ball: 2, batterIdx: 0 },
      { wicket: 2, score: 65, over: 8, ball: 5, batterIdx: 1 },
      { wicket: 3, score: 110, over: 14, ball: 1, batterIdx: 2 },
    ];

    let currentSeq = 1;
    for (const data of fowData) {
      // Create a delivery that caused the wicket
      const delivery = await this.deliveryRepo.save({
        matchId: match.id,
        inningsId: innings.id,
        seq: currentSeq++,
        overNumber: data.over,
        ballIndex: data.ball,
        kind: DeliveryKind.RUN, // Wickets are usually on RUN or Wicket type
        isLegal: true,
        strikerSquadId: squadEntries1[data.batterIdx].id,
        nonStrikerSquadId: squadEntries1[data.batterIdx + 1]?.id || squadEntries1[0].id,
        bowlerSquadId: squadEntries2[0].id,
        total_runs: 0,
      });

      await this.wicketRepo.save({
        inningsId: innings.id,
        type: WicketType.BOWLED,
        outBatsmanSquadId: squadEntries1[data.batterIdx].id,
        teamScore: data.score,
        causedByDeliverySeq: delivery.id,
      });
    }

    return { 
        status: 'success', 
        matchId: match.id, 
        teamId: teams[0].id, 
        inningsId: innings.id,
        message: 'Seeded successfully'
    };
  }
}
