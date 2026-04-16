import { Module } from '@nestjs/common';
import { OverSummaryService } from '../oversummary/oversummary.service';
import { ScoreboardService } from '../scoreboard/scoreboard.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreboardState } from '../Entity/scoreboard_stat.entity'; // Assuming this is the correct entity
import { Innings } from 'src/Entity/inning.entity';
import { SquadService } from 'src/squad/squad.service';
import { MatchSquad } from 'src/Entity/squad.entity';
import { Match } from 'src/Entity/match.entity';
import { MatchBatting } from 'src/Entity/match_betting.entity';
import { OverSummary } from 'src/Entity/over_summary.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScoreboardState,Innings, MatchSquad,Match,MatchBatting,OverSummary]),  // Make sure ScoreboardState is imported
  ],
  providers: [OverSummaryService, ScoreboardService,], // Include all necessary services
  exports: [OverSummaryService],  // Export the service for use in other modules
})
export class OverSummaryModule {}
