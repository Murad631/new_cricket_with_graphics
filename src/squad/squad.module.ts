// src/squad/squad.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SquadController } from './squad.controller';
import { SquadService } from './squad.service';

import { MatchSquad } from '../Entity/squad.entity';
import { Match } from '../Entity/match.entity';
import { Team } from '../Entity/team.entity';
import { Player } from '../Entity/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchSquad, Match, Team, Player])],
  controllers: [SquadController],
  providers: [SquadService],
  exports :[SquadService]
})
export class SquadModule {}
