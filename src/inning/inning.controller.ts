import { Controller, Post, Get, Put, Delete, Param, Body, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';
import { InningsService } from '../inning/inning.service';

@UseGuards(JwtGuard)
@Controller('innings')
export class InningsController {
  constructor(private readonly inningsService: InningsService) {}

  // POST /innings/store
  @Post('store')
  create(@Body() data: any) {
    return this.inningsService.create(data);
  }

  // GET /innings/list?matchId=1
  @Get('list')
  list(@Query('matchId') matchId?: string) {
    return this.inningsService.list(matchId ? Number(matchId) : undefined);
  }

  // GET /innings/find/10
  @Get('find/:id')
  find(@Param('id', ParseIntPipe) id: number) {
    return this.inningsService.findOne(id);
  }

  // PUT /innings/update/10
  @Put('update/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.inningsService.update(id, data);
  }

  // DELETE /innings/delete/10 (soft)
  @Delete('delete/:id')
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.inningsService.deactivate(id);
  }

  // PUT /innings/activate/10
  @Put('activate/:id')
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.inningsService.activate(id);
  }
}
