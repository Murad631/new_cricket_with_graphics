import {
  Controller, Post, Get, Put, Delete, Param, Body,
  UseGuards, UploadedFile, UseInterceptors, ParseIntPipe,
  Query,
} from '@nestjs/common';
import { IsNotEmpty, IsString, IsInt, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { PlayerRole } from '../Entity/enums';
import { FileInterceptor } from '@nestjs/platform-express';
import { PlayerService } from '../players/players.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { teamLogoUploadOptions } from '../imports/team-upload.config';  // Same upload config for player logo
 
export class CreatePlayerDto {
  @IsNotEmpty()
  @IsInt()
  teamId: number;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEnum(PlayerRole)
  role: PlayerRole;

  @IsNotEmpty()
  @IsInt()
  shirtNo: number;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  battingStyle?: string;

  @IsOptional()
  @IsString()
  bowlingStyle?: string;

  @IsOptional()
  @IsInt()
  noOfMatches?: number;

  @IsOptional()
  @IsString()
  strikeRate?: string;

  @IsOptional()
  @IsString()
  image?: string;
}

@UseGuards(JwtGuard)
@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) { }

  @Post('store')
  @UseInterceptors(FileInterceptor('logo', teamLogoUploadOptions))
  async create(@Body() data: CreatePlayerDto, @UploadedFile() logo?: Express.Multer.File) {
    return this.playerService.create(data, logo);
  }

  @Get('list')
  async findAll() {
    return this.playerService.findAll();
  }

  @Get('find/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.playerService.findOne(id);
  }

  @Put('update/:id')
  @UseInterceptors(FileInterceptor('logo', teamLogoUploadOptions))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CreatePlayerDto>,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    return this.playerService.update(id, data, logo);
  }

  @Delete('delete/:id')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.playerService.deactivate(id);
  }

  @Put('activate/:id')
  async activate(@Param('id', ParseIntPipe) id: number) {
    return this.playerService.activate(id);
  }


  @Get(':id/lower-third')
  async lowerThird(
    @Param('id', ParseIntPipe) id: number,
    @Query('matchId') matchId?: string,
  ) {
    return this.playerService.playerLowerThird(id, matchId ? Number(matchId) : undefined);
  }
}
