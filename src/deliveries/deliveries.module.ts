// src/delivery/delivery.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from '../Entity/deliveries.entity';
import { DeliveryService } from '../deliveries/deliveries.service';
import { ScoreboardModule } from 'src/scoreboard/scoreboard.module';
import { Wicket } from 'src/Entity/wicket.entity';
import { PlayerGateway } from 'src/player.gateway';
import { DeliveriesController } from './deliveries.controller';
import { OverSummary } from 'src/Entity/over_summary.entity';
import { MatchBatting } from 'src/Entity/match_betting.entity';
import { Match } from 'src/Entity/match.entity';
import { Innings } from 'src/Entity/inning.entity';
import { Team } from 'src/Entity/team.entity';
import { MatchSquad } from 'src/Entity/squad.entity';
import { Player } from 'src/Entity/player.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Delivery, Wicket, OverSummary, MatchBatting, Match, Innings, Team, MatchSquad, Player]), ScoreboardModule],

  providers: [DeliveryService],
  controllers : [DeliveriesController ],
  exports: [DeliveryService],  // Export service for other modules to use
})
export class DeliveryModule {}