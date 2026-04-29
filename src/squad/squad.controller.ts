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
import { SquadService } from './squad.service';
import { IsNotEmpty, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateSquadDto {
  @IsNotEmpty()
  @IsInt()
  teamId: number;

  @IsNotEmpty()
  @IsInt()
  playerId: number;

  @IsOptional()
  @IsBoolean()
  isPlayingXI?: boolean;

  @IsOptional()
  @IsBoolean()
  isCaptain?: boolean;

  @IsOptional()
  @IsBoolean()
  isViceCaptain?: boolean;

  @IsOptional()
  @IsBoolean()
  isWicketKeeper?: boolean;

  @IsOptional()
  @IsInt()
  battingPos?: number;
}

@UseGuards(JwtGuard)
@Controller('squad')
export class SquadController {
  constructor(private readonly squadService: SquadService) { }


  // ✅ POST /squad/:matchId/store
  @Post('store/:matchId')
  async createStore(
    @Param('matchId', ParseIntPipe) matchId: number,
    @Body() data: CreateSquadDto,
  ) {
    return this.squadService.create(matchId, data);
  }

  // ✅ GET /squad/:matchId  (optional ?teamId=)
  @Get('list/:matchId')
  async listBase(
    @Param('matchId', ParseIntPipe) matchId: number,
    @Query('teamId') teamId?: string,
  ) {
    return this.squadService.findAllWithJoins(matchId, teamId ? Number(teamId) : undefined);
  }

  // ✅ GET /squad/:matchId/list
  @Get('list')
  list(
    @Param('matchId', ParseIntPipe) matchId: number,
    @Query('teamId') teamId?: string,
  ) {
    return this.squadService.findAllWithJoins(matchId, teamId ? Number(teamId) : undefined);
  }

  // ✅ GET /squad/:matchId/find/:id
  // @Get('find/:id')
  // findOne(
  //   @Param('matchId', ParseIntPipe) matchId: number,
  //   @Param('id', ParseIntPipe) id: number,
  // ) {
  //   return this.squadService.findOneWithJoins(matchId, id);
  // }
  @Get(':matchId/find/:id')
  findOne(
    @Param('matchId', ParseIntPipe) matchId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.squadService.findOneWithJoins(matchId, id);
  }

  // ✅ PUT /squad/:matchId/update/:id
  @Put(':matchId/update/:id')
  update(
    @Param('matchId', ParseIntPipe) matchId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CreateSquadDto>,
  ) {
    return this.squadService.update(matchId, id, data);
  }

  // ✅ DELETE /squad/:matchId/delete/:id
  @Delete(':matchId/delete/:id')
  deactivate(
    @Param('matchId', ParseIntPipe) matchId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.squadService.deactivate(matchId, id);
  }

  // ✅ PUT /squad/:matchId/activate/:id
  @Put(':matchId/activate/:id')
  activate(
    @Param('matchId', ParseIntPipe) matchId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.squadService.activate(matchId, id);
  }

  //graphics 

  @Get('get-matches-squads/:matchId')
  matchSquadBoth(@Param('matchId', ParseIntPipe) matchId: number) {
    return this.squadService.matchSquadBothTeams(matchId);
  }

  @Get('get-matches-squads/:matchId/team/:teamId')
  matchSquadTeam(
    @Param('matchId', ParseIntPipe) matchId: number,
    @Param('teamId', ParseIntPipe) teamId: number,
  ) {
    return this.squadService.matchSquadSingleTeam(matchId, teamId);
  }
}
