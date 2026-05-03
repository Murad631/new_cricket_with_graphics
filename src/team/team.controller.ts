import {
  Controller, Post, Get, Put, Delete, Param, Body,
  UseGuards, UploadedFile, UseInterceptors,
  BadRequestException, ParseIntPipe, InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TeamService } from './team.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { teamLogoUploadOptions } from '../imports/team-upload.config';
import { CreateTeamDto } from './create-team.dto';

@UseGuards(JwtGuard)
@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) { }

  @Post('store')
  @UseInterceptors(FileInterceptor('logo', teamLogoUploadOptions))
  async create(@Body() data: CreateTeamDto, @UploadedFile() logo?: Express.Multer.File) {
    try {
      if (logo) data.logo = logo.path;
      return await this.teamService.create(data);
    } catch (err) {
    }      throw new InternalServerErrorException('Failed to create team');

  }

  @Get('list')
  async findAll() {
    try {
      return await this.teamService.findAll();
    } catch (err) {
      throw new InternalServerErrorException('Failed to fetch teams');
    }
  }

  @Get('find/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teamService.findOne(id);
  }

  @Get('team-players')
  async teamWithPlayersAll() {
    const palyers = await this.teamService.teamWithPalyer();
    return palyers;
  }

  @Get('team-players/:id')
  teamWithPlayersById(@Param('id', ParseIntPipe) id: number) {
    return this.teamService.teamWithPalyer(id);
  }
  @Put('update/:id')
  @UseInterceptors(FileInterceptor('logo', teamLogoUploadOptions))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CreateTeamDto>,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    try {
      if (logo) data.logo = logo.path;
      return await this.teamService.update(id, data);
    } catch (err) {
      throw err;
    }
  }

  @Delete('delete/:id')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.teamService.remove(id);
  }

  @Put('activate/:id')
  async activate(@Param('id', ParseIntPipe) id: number) {
    return this.teamService.activate(id);
  }
}
