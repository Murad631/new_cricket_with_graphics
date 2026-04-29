// src/match/match.controller.ts
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';
import { MatchService } from '../matches/matches.service';
import { IsNotEmpty, IsString, IsInt, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { MatchFormat, MatchStatus, TossDecision } from '../Entity/enums';

export class CreateMatchDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(MatchFormat)
  format: MatchFormat;

  @IsOptional()
  @IsInt()
  poolId?: number;

  @IsNotEmpty()
  @IsInt()
  team1Id: number;

  @IsNotEmpty()
  @IsInt()
  team2Id: number;

  @IsOptional()
  @IsString()
  venue?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  umpire1?: string;

  @IsOptional()
  @IsString()
  umpire2?: string;

  @IsOptional()
  @IsString()
  referee?: string;

  @IsOptional()
  @IsDateString()
  startTime?: Date;

  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;

  @IsOptional()
  @IsInt()
  oversLimit?: number;

  @IsOptional()
  @IsInt()
  ballsPerOver?: number;

  @IsOptional()
  @IsInt()
  tossWinnerTeamId?: number;

  @IsOptional()
  @IsEnum(TossDecision)
  tossDecision?: TossDecision;
}

@UseGuards(JwtGuard)
@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) { }

  @Post('store')
  create(@Body() data: CreateMatchDto) {
    return this.matchService.create(data);
  }

  @Get('list')
  findAll() {
    return this.matchService.findAllWithTeams();
  }

  @Get('find/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.matchService.findOneWithTeams(id);
  }

  @Put('update/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<CreateMatchDto>) {
    return this.matchService.update(id, data);
  }

  @Delete('delete/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.matchService.remove(id);
  }

  //graphics
  @Get('matches-details')
  async list() {
    return this.matchService.listMatchesWithTeamsAndCaptains();
  }

  @Get('matches-details/:id')
  async lister(@Param('id') id: number) {
    return this.matchService.listMatchesWithTeamsAndCaptains(id);
  }


  @Get('tournaments/:typeId/overview')
  overview(@Param('typeId', ParseIntPipe) typeId: number) {
    return this.matchService.overview(typeId);
  }

  @Get(':matchId/teams')
  async getTeamsByMatchId(@Param('matchId', ParseIntPipe) matchId: number) {
    return this.matchService.getTeamsByMatchId(matchId);
  }
}
