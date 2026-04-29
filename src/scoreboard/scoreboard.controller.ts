import { Controller, Put, Get, Param, Body, ParseIntPipe, UseGuards, Post, BadRequestException } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ScoreboardService } from '../scoreboard/scoreboard.service';
import { PlayerGateway } from '../player.gateway';
import { EventEmitter2 } from '@nestjs/event-emitter';

@UseGuards(JwtGuard)
@Controller('scoreboard')
export class ScoreboardController {

  constructor(private readonly service: ScoreboardService,   private readonly eventEmitter: EventEmitter2,) {}

  @Post('start-innning')
  async startInning(@Body() body:any){
    if(!body.id)  throw new BadRequestException('Please Insert the inning ID');
      const start = await this.service.startInning(body);

      return start;
    }

 
    @Post('setPlayers')
    async setPlayers(@Body() body: any) {
  
      const striker = body.striker || body.strikerSquadId;
      const nonStriker = body.nonStriker || body.nonStrikerSquadId;
      const bowler = body.bowler || body.bowlerSquadId;

      const result = await this.service.setPlayers({ striker, nonStriker, bowler });

       this.eventEmitter.emitAsync('scoreboard.players.update', result);


      return result;
    }


     @Put('switchPlayers')
    async switchPlayers() { 
      const result = await this.service.switchPlayers();
      this.eventEmitter.emitAsync('switch-player', result);
      return result;
    }

  @Put()
  setState(
    @Param('matchId', ParseIntPipe) matchId: number,
    @Body() data: any,
  ) {
    return this.service.setState(matchId, data);
  }

  // GET /scoreboard/:matchId/state
  @Get(':matchId/state')
  getState(@Param('matchId', ParseIntPipe) matchId: number) {
    return this.service.getState(matchId);
  }


  @Post('dynamicText')
  async dynamicTest(@Body() body:any){
    
      this.eventEmitter.emitAsync('scoreboard.dynamic.text', body.text);
  }
}
