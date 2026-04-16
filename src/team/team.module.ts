import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from 'src/Entity/team.entity';
import { Player } from 'src/Entity/player.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Team,Player])],
  controllers: [TeamController],
  providers: [TeamService]
})
export class TeamModule {}
