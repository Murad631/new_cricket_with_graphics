import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ScoringService } from './scoring.service';

@Controller('scoring')
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  /**
   * Process a scoring event (e.g., a ball, wide, no-ball, wicket).
   * This is the main endpoint for updating the match and scoreboard.
   * @param dto - The scoring data to process.
   */
  // @Post('process')
  // async processScoring(@Body() dto: any): Promise<any> {
  //   try {
  //     const result = await this.scoringService.processScoring(dto); // Process the scoring event.
  //     return result;
  //   } catch (error) {
  //     throw new BadRequestException('Error processing scoring', error.message);
  //   }
  // }
}
