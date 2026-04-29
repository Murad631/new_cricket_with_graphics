import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerGateway } from './player.gateway';
import { MatchesModule } from './matches/matches.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { TeamModule } from './team/team.module';
import { PlayersModule } from './players/players.module';
import { SquadModule } from './squad/squad.module';
import { InningModule } from './inning/inning.module';
import { ScoreboardModule } from './scoreboard/scoreboard.module';
import { ScoringModule } from './scoring/scoring.module';
import { DeliveryService } from './deliveries/deliveries.service';
import { DeliveryModule } from './deliveries/deliveries.module';
import { WicketModule } from './wicket/wicket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OverSummaryModule } from './oversummary/over-summary.module';
import { MatchSettingController } from './match-setting/match-setting.controller';
import { MatchSettingModule } from './match-setting/match-setting.module';
import { GraphicsModule } from './graphics/graphics.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'cricket',
      synchronize: true, // dev only
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // ✅ auto detect
    }),
    EventEmitterModule.forRoot(),
    MatchesModule,
    AuthModule,
    UsersModule,
    TeamModule,
    PlayersModule,
    SquadModule,
    InningModule,
    ScoreboardModule,
    ScoringModule,
    DeliveryModule,
    WicketModule,
    OverSummaryModule,
    MatchSettingModule,
    GraphicsModule
  ],
  controllers: [AppController, MatchSettingController],
  providers: [AppService, PlayerGateway],
})
export class AppModule { }
