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

@UseGuards(JwtGuard)
@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('store')
  create(@Body() data: any) {
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
  update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
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
    async lister(@Param('id') id:number) {
      return this.matchService.listMatchesWithTeamsAndCaptains(id );
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
