import { Injectable, BadRequestException } from '@nestjs/common';
import { DeliveryService } from '../deliveries/deliveries.service';
import { WicketService } from '../wicket/wicket.service';
import { ScoreboardService } from '../scoreboard/scoreboard.service';
import { DeliveryKind } from '../Entity/enums';  // Enum for different types of deliveries

@Injectable()
export class ScoringService {
  constructor(
    private readonly deliveryService: DeliveryService,
    private readonly wicketService: WicketService,
    private readonly scoreboardService: ScoreboardService,
  ) {}


  // async processScoring(dto: any): Promise<any> {
  //   const { matchId, extraType, runsOffBat, isWicket, wicketType, extraRuns, ballType } = dto;

  //   // 1️⃣ Get the current match state
  //   const state = await this.scoreboardService.getState(matchId);

  //   console.log('state',  state)
  //   if (!state) throw new BadRequestException('Scoreboard state not found');

  //   // 2️⃣ Process the delivery (run, wide, no-ball, etc.)
  //   const delivery = await this.deliveryService.createFromUI(dto);

  //   // 3️⃣ Update over summary with the ball type (run, wide, etc.)
  //   await this.scoreboardService.updateOverSummary(matchId, ballType);

  //   // 4️⃣ If a wicket occurred, process it
  //   if (isWicket) {
  //     if (!state.currentInningsId || !state.strikerSquadId) {
  //       throw new BadRequestException('Incomplete state: missing innings or striker');
  //     }
  //     await this.wicketService.processWicket(state.currentInningsId, state.strikerSquadId, state.bowlerSquadId, wicketType);
  //   }

  //   // 5️⃣ Return updated data (delivery info, scoreboard info)
  //   return {
  //     delivery: delivery,
  //     scoreboard: await this.scoreboardService.getState(matchId),
  //   };
  // }
}
