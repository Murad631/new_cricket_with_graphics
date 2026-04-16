// wicket.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wicket } from '../Entity/wicket.entity';           // ← your entity
import { WicketService } from './wicket.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Wicket]),   // ← THIS LINE IS CRITICAL!
  ],

  providers: [WicketService],

})
export class WicketModule {}