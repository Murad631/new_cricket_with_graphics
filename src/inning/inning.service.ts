import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Innings } from '../Entity/inning.entity';
import { Match } from '../Entity/match.entity';
import { Team } from '../Entity/team.entity';

@Injectable()
export class InningsService {
  constructor(
    @InjectRepository(Innings) private readonly innRepo: Repository<Innings>,
    @InjectRepository(Match) private readonly matchRepo: Repository<Match>,
    @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
  ) {}

  async create(data: any) {
    const matchId = Number(data.matchId);
    if (!matchId) throw new BadRequestException('matchId is required');

    const match = await this.matchRepo.findOne({ where: { id: matchId } });
    if (!match) throw new NotFoundException('Match not found');

    const battingTeamId = Number(data.battingTeamId);
    const bowlingTeamId = Number(data.bowlingTeamId);

    if (!battingTeamId || !bowlingTeamId) throw new BadRequestException('battingTeamId & bowlingTeamId required');

    // ensure batting/bowling are part of match
    if (![match.team1Id, match.team2Id].includes(battingTeamId) || ![match.team1Id, match.team2Id].includes(bowlingTeamId)) {
      throw new BadRequestException('battingTeamId/bowlingTeamId must be match teams');
    }


    const fetchInning = await this.innRepo.findOne({where:{matchId :match.id, 
    battingTeamId:battingTeamId, bowlingTeamId:bowlingTeamId, isActive:true }});
    if (fetchInning) throw new BadRequestException('Inning Already Found');
    
   const row1 = this.innRepo.create({
    matchId : matchId,
    number: 'FIRST',
    battingTeamId,
    bowlingTeamId,
    targetRuns: data.targetRuns ? Number(data.targetRuns) : null,
    startedAt: data.startedAt ? new Date(data.startedAt) : null,
    endedAt: data.endedAt ? new Date(data.endedAt) : null,
    isActive: true,
  } as any);

// Create the second row where the batting and bowling teams are swapped
  const row2 = this.innRepo.create({
    matchId : matchId,
    number: 'SECOND',
    battingTeamId: bowlingTeamId ,  // Swap batting and bowling
    bowlingTeamId:battingTeamId  ,  // Swap batting and bowling
    targetRuns: data.targetRuns ? Number(data.targetRuns) : null,
    startedAt: data.startedAt ? new Date(data.startedAt) : null,
    endedAt: data.endedAt ? new Date(data.endedAt) : null,
    isActive: true,
  } as any);

// Insert both records in a transaction (atomic operation)
await this.innRepo.manager.transaction(async (manager) => {
  await manager.save(row1);
  await manager.save(row2);
});

    return {row1 , row2 }
  }

  async list(matchId?: number) {
    const where: any = { isActive: true };
    if (matchId) where.matchId = matchId;
    return this.innRepo.find({ where, order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const row = await this.innRepo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Innings not found');
    return row;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    await this.innRepo.update({ id }, data);
    return this.findOne(id);
  }

  async deactivate(id: number) {
    await this.findOne(id);
    await this.innRepo.update({ id }, { isActive: false });
    return { ok: true, message: 'Innings deactivated' };
  }

  async activate(id: number) {
    await this.findOne(id);
    await this.innRepo.update({ id }, { isActive: true });
    return { ok: true, message: 'Innings activated' };
  }
}
