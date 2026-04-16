import { Module } from '@nestjs/common';
import { InningsController } from '../inning/inning.controller';
import { InningsService } from '../inning/inning.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Innings } from 'src/Entity/inning.entity';
import { Match } from 'src/Entity/match.entity';
import { Team } from 'src/Entity/team.entity';

@Module({
  
  imports : [TypeOrmModule.forFeature([Innings,Match,Team])],
  controllers: [InningsController],
  providers: [InningsService]
})
export class InningModule {}
