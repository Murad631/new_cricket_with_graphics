import { Module } from '@nestjs/common';
import { PlayerService } from './players.service';
import { PlayerController } from './players.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from 'src/Entity/player.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Player])],
  providers: [PlayerService],
  controllers: [PlayerController]

})
export class PlayersModule {}
