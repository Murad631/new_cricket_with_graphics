import { Controller, Put, Get, Param, Body, ParseIntPipe, UseGuards, Post, BadRequestException } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';
import { DeliveryService } from './deliveries.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@UseGuards(JwtGuard)
@Controller('delivery')
export class DeliveriesController {


  constructor(
    private readonly service: DeliveryService, private readonly eventEmitter: EventEmitter2,) { }

  @Post('ball')
  async startInning(@Body() body: any) {
    const delivery = await this.service.deliveryRecording(body);
    return delivery;
  }


  @Post('current-run-rate')
  async getRunRates(@Body() body: any) {
    const delivery = await this.service.getRunRates(body.matchId);

    this.eventEmitter.emitAsync('show-crr', delivery);
    return delivery;
  }



  @Post('required-run-rate')
  async getRequiredRunRates(@Body() body: any) {
    const delivery = await this.service.getRunRates(body.matchId);

    this.eventEmitter.emitAsync('show-rrr', delivery);
    return delivery;
  }


  @Post('inning-end')
  async InningEnd(@Body() body: any) {
    const endInning = await this.service.inningEnd(body.matchId);
    return endInning
  }


}
