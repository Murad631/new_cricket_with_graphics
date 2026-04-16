  import { Module } from '@nestjs/common';
  import { ScoreboardController } from './scoreboard.controller';
  import { ScoreboardService } from './scoreboard.service';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { Innings } from 'src/Entity/inning.entity';
  import { ScoreboardState } from 'src/Entity/scoreboard_stat.entity';
  import { MatchSquad } from 'src/Entity/squad.entity';
  import { Match } from 'src/Entity/match.entity';
import { PlayerGateway } from 'src/player.gateway';
import { MatchBatting } from 'src/Entity/match_betting.entity';
import { OverSummary } from 'src/Entity/over_summary.entity';

  @Module({
    imports: [TypeOrmModule.forFeature([Innings, ScoreboardState, MatchSquad, Match, MatchBatting,OverSummary])],
    controllers: [ScoreboardController],
    providers: [ScoreboardService],
    exports: [ScoreboardService],       // Make sure to export
  })
  export class ScoreboardModule {}
