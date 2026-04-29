import { Controller, Get, Post, Body, Param, Query, Patch, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Response } from 'express';

import { GraphicsService } from './graphics.service';
import { FowSeeder } from '../seeder/seed-fow';
import { Sponsor } from '../Entity/sponsor.entity';
import { PitchReport } from '../Entity/pitch_report.entity';
import { IsNotEmpty, IsString, IsInt, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateSponsorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  header?: string;

  @IsOptional()
  @IsString()
  tagline?: string;

  @IsOptional()
  @IsNumber()
  charges?: number;

  @IsOptional()
  @IsInt()
  show_count?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  image?: string;
}

export class CreatePitchReportDto {
  @IsNotEmpty()
  @IsInt()
  matchId: number;

  @IsOptional()
  @IsInt()
  inningsId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  grassCover?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  turnProjection?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  paceBounce?: number;

  @IsOptional()
  @IsString()
  pitchType?: string;

  @IsOptional()
  @IsString()
  boundaries?: string;

  @IsOptional()
  @IsString()
  avgScore?: string;

  @IsOptional()
  @IsString()
  matchType?: string;
}

@Controller('api/graphics')
export class GraphicsController {
  constructor(
    private readonly graphicsService: GraphicsService,
    private readonly fowSeeder: FowSeeder,
    private eventEmitter: EventEmitter2
  ) { }

  @Get('phase1/all-matches')
  async getAllMatches() {
    const data = await this.graphicsService.getAllMatches();
    const payload = { type: 'update', graphic: 'all_matches', data };
    this.eventEmitter.emit('graphic_event', payload);
    return payload;
  }

  @Get('phase1/batting-card/:matchId')
  async getBattingCard(@Param('matchId') matchId: string) {
    const payload = await this.graphicsService.getBattingCard(parseInt(matchId));
    this.eventEmitter.emit('graphic_event', payload);
    return payload;
  }

  @Get('phase1/bowling-panel/:matchId')
  async getBowlingPanel(@Param('matchId') matchId: string) {
    const payload = await this.graphicsService.getBowlingPanel(parseInt(matchId));
    this.eventEmitter.emit('graphic_event', payload);
    return payload;
  }

  @Get('phase1/full-scoreboard/:matchId')
  async getFullScoreboard(@Param('matchId') matchId: string) {
    const payload = await this.graphicsService.getFullScoreboard(parseInt(matchId));
    this.eventEmitter.emit('graphic_event', payload);
    return payload;
  }

  @Get('phase2/match-summary/:matchId')
  async getMatchSummary(@Param('matchId') matchId: string) {
    const payload = await this.graphicsService.getMatchSummary(parseInt(matchId));
    this.eventEmitter.emit('graphic_event', payload);
    return payload;
  }

  // ==========================================
  // --- PHASE 3 & 4: SPONSOR CONTROL & UPLOAD ---
  // ==========================================

  @Get('sponsors')
  async listSponsors() {
    return await this.graphicsService.listSponsors();
  }

  @Post('sponsors')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/sponsors',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  async createSponsor(@Body() data: CreateSponsorDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      data.image = `/uploads/sponsors/${file.filename}`;
    }
    return await this.graphicsService.createSponsor(data);
  }

  @Patch('sponsors/:id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/sponsors',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  async updateSponsor(@Param('id') id: string, @Body() data: Partial<CreateSponsorDto>, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      data.image = `/uploads/sponsors/${file.filename}`;
    }
    return await this.graphicsService.updateSponsor(parseInt(id), data);
  }

  @Delete('sponsors/:id')
  async deleteSponsor(@Param('id') id: string) {
    return await this.graphicsService.deleteSponsor(parseInt(id));
  }

  @Post('sponsors/trigger/:id')
  async triggerSponsor(@Param('id') id: string) {
    const payload = await this.graphicsService.triggerSponsor(parseInt(id));
    if (payload.type === 'update') {
      this.eventEmitter.emit('graphic_event', payload);
    }
    return payload;
  }

  // ==========================================
  // --- PHASE 3: PITCH REPORT ---
  // ==========================================

  @Post('pitch-report')
  async upsertPitchReport(@Body() data: CreatePitchReportDto) {
    return await this.graphicsService.upsertPitchReport(data);
  }

  @Get('pitch-report/:matchId/:inningsId')
  async getPitchReport(@Param('matchId') matchId: string, @Param('inningsId') inningsId: string) {
    return await this.graphicsService.getPitchReport(parseInt(matchId), parseInt(inningsId));
  }

  @Post('pitch-report/trigger/:matchId/:inningsId')
  async triggerPitchReport(@Param('matchId') matchId: string, @Param('inningsId') inningsId: string) {
    const payload = await this.graphicsService.triggerPitchReport(parseInt(matchId), parseInt(inningsId));
    this.eventEmitter.emit('graphic_event', payload);
    return payload;
  }

  // ==========================================
  // --- PHASE 3: CONTROL LISTINGS ---
  // ==========================================

  @Get('control/matches')
  async listMatches() {
    return await this.graphicsService.listMatches();
  }

  @Get('over-summary/trigger/:matchId/:inningsId/:overNumber')
  async triggerOverSummary(
    @Param('matchId') matchId: string,
    @Param('inningsId') inningsId: string,
    @Param('overNumber') overNumber: string,
    @Res() res: Response
  ) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    const payload = await this.graphicsService.triggerOverSummary(
      parseInt(matchId),
      parseInt(inningsId),
      parseInt(overNumber)
    );
    this.eventEmitter.emit('graphic_event', payload);
    return res.json(payload);
  }

  @Get('control/overs/:matchId/:inningsId')
  async listOvers(@Param('matchId') matchId: string, @Param('inningsId') inningsId: string) {
    return await this.graphicsService.listOvers(parseInt(matchId), parseInt(inningsId));
  }

  @Get('phase-summary/:matchId/:inningsId') // Specific match/innings
  async getPhaseSummary(
    @Param('matchId') matchId: string,
    @Param('inningsId') inningsId: string,
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('tag') tag: string,
    @Res() res: Response
  ) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    const payload = await this.graphicsService.getPhaseSummary(
      parseInt(matchId), parseInt(inningsId), parseInt(start), parseInt(end), tag
    );
    this.eventEmitter.emit('graphic_event', payload);
    return res.json(payload);
  }

  @Get('phase-summary-latest') // Auto-detect match/innings
  async getPhaseSummaryLatest(
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('tag') tag: string,
    @Res() res: Response
  ) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    const payload = await this.graphicsService.getPhaseSummary(
      undefined, undefined, parseInt(start || '0'), parseInt(end || '5'), tag
    );
    this.eventEmitter.emit('graphic_event', payload);
    return res.json(payload);
  }

  @Post('trigger-tag/:type')
  async triggerTag(@Param('type') type: string) {
    const payload = await this.graphicsService.triggerPhaseTag(type);
    this.eventEmitter.emit('graphic_event', payload);
    return payload;
  }

  @Get('phase2/test-seed-fow')
  async seedFow() {
    return await this.fowSeeder.seed();
  }

  @Get('leaderboard/sixes')
  async getTopSixHitters() {
    const payload = await this.graphicsService.getTopSixHitters();
    this.eventEmitter.emit('graphic_event', payload);
    return payload;
  }

  @Get('matches/list')
  async listAllMatches() {
    return await this.graphicsService.listAllMatches();
  }

  @Get('match-details/trigger/:matchId')
  async triggerMatchDetails(@Param('matchId') matchId: string) {
    const payload = await this.graphicsService.triggerMatchDetails(parseInt(matchId));
    if (payload.type === 'update') {
      this.eventEmitter.emit('graphic_event', payload);
    }
    return payload;
  }

  @Get('teams/list')
  async listTeams() {
    return await this.graphicsService.listTeams();
  }

  @Get('playing-xi/trigger/:matchId/:teamId')
  async triggerPlayingXI(@Param('matchId') matchId: string, @Param('teamId') teamId: string) {
    const payload = await this.graphicsService.triggerPlayingXI(parseInt(matchId), parseInt(teamId));
    if (payload.type === 'update') {
      this.eventEmitter.emit('graphic_event', payload);
    }
    return payload;
  }

  @Get('scoreboard/trigger/:action')
  async triggerScoreboard(@Param('action') action: 'show' | 'hide') {
    const payload = await this.graphicsService.triggerScoreboard(action);
    this.eventEmitter.emit('graphic_event', payload);
    return payload;
  }
}
