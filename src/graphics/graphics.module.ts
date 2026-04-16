import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphicsController } from './graphics.controller';
import { GraphicsService } from './graphics.service';

import { Match } from '../Entity/match.entity';
import { Team } from '../Entity/team.entity';
import { MatchBatting } from '../Entity/match_betting.entity';
import { OverSummary } from '../Entity/over_summary.entity';
import { ScoreboardState } from '../Entity/scoreboard_stat.entity';
import { Delivery } from '../Entity/deliveries.entity';
import { Wicket } from '../Entity/wicket.entity';
import { MatchSquad } from '../Entity/squad.entity';
import { Player } from '../Entity/player.entity';
import { Innings } from '../Entity/inning.entity';
import { Sponsor } from '../Entity/sponsor.entity';
import { SponsorLog } from '../Entity/sponsor_log.entity';
import { PitchReport } from '../Entity/pitch_report.entity';
import { FowSeeder } from '../seeder/seed-fow';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Match,
      Team,
      MatchBatting,
      OverSummary,
      ScoreboardState,
      Delivery,
      Wicket,
      MatchSquad,
      Player,
      Innings,
      Sponsor,
      SponsorLog,
      PitchReport
    ])
  ],
  providers: [GraphicsService, FowSeeder],
  controllers: [GraphicsController],
  exports: [GraphicsService]
})
export class GraphicsModule {}
