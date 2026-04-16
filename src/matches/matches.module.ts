import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchController } from './matches.controller';
import { MatchService } from './matches.service';
import { Match } from '../Entity/match.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Team } from 'src/Entity/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match,Team]), AuthModule],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchesModule {}
