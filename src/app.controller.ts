import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PlayerGateway } from './player.gateway';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private playerGateway: PlayerGateway
  ) {}


  @Post('update-run')
  testUpdate(@Body() payload: any) {

    console.log(payload);
    this.playerGateway.setPalyersOnSB(payload);
    return { status: 'success', sentPayload: payload };
  }



  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
