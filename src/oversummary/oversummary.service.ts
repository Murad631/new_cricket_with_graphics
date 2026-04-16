import { Injectable } from '@nestjs/common';
import { ScoreboardService } from '../scoreboard/scoreboard.service';  // Import scoreboard state service

@Injectable()
export class OverSummaryService {
  constructor(
    private readonly scoreboardStateService: ScoreboardService, // To track match state
  ) {}

  /**
   * Updates the current over summary (runs, extras, wickets, etc.)
   */
  // async updateOverSummary(matchId: number, ballResult: string) {
  //   // 1️⃣ Fetch current match state
  //   const state = await this.scoreboardStateService.getState(matchId);
  //   if (!state) {
  //     throw new Error('Scoreboard state not found');
  //   }

  //   // 2️⃣ Track current over events
  //   const currentOverEvents = state.currentOverEvents || [];

  //   // 3️⃣ Add ball result to the over
  //   currentOverEvents.push(ballResult);  // Ball result could be '1', '4', '6', 'WD', 'NB', 'W' etc.

  //   // 4️⃣ Update state with new over events
  //   state.currentOverEvents = currentOverEvents;

  //   // 5️⃣ If 6 balls have been bowled, increment over number
  //   if (currentOverEvents.length === 6) {
  //     state.currentOverNumber += 1;  // Increment over
  //     state.currentOverEvents = [];  // Reset over events after 6 balls
  //   }

  //   // 6️⃣ Save the updated state
  //   await this.scoreboardStateService.setState(matchId, state);

  //   return state;  // Return updated state for any further use or response
  // }
}
