import { Module } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { ScoreboardService } from '../scoreboard/scoreboard.service'; // Assuming the ScoreboardService is available

import { WicketService } from '../wicket/wicket.service'; // Assuming the WicketService is available
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from '../Entity/deliveries.entity'; // Assuming this is your Delivery entity

import { ScoreboardState } from '../Entity/scoreboard_stat.entity'; // Assuming this is your ScoreboardState entity
import { Wicket } from 'src/Entity/wicket.entity';
import { DeliveryService } from 'src/deliveries/deliveries.service';
import { Innings } from 'src/Entity/inning.entity';
import { MatchSquad } from 'src/Entity/squad.entity';
import { Match } from 'src/Entity/match.entity';
import { ScoringController } from './scoring.controller';
import { OverSummary } from 'src/Entity/over_summary.entity';
import { MatchBatting } from 'src/Entity/match_betting.entity';
import { Team } from 'src/Entity/team.entity';
import { Player } from 'src/Entity/player.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Delivery, Wicket, MatchSquad, Match, ScoreboardState, Innings, OverSummary, MatchBatting, Team, Player])], // Register the necessary entities

  providers: [ScoringService, ScoreboardService, DeliveryService, WicketService],
  controllers : [ScoringController],
  exports: [ScoringService], // Exporting for other modules to access
})
export class ScoringModule {}
