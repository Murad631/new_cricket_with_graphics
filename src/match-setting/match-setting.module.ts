import { Module } from '@nestjs/common';
import { MatchSettingService } from './match-setting.service';
import { MatchSettingController } from './match-setting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pool } from 'src/Entity/pool.entity';
import { Type } from 'src/Entity/type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pool, Type])],
  providers: [MatchSettingService],
  controllers: [MatchSettingController],
  exports: [MatchSettingService], // 👈 IMPORTANT
})
export class MatchSettingModule { }
