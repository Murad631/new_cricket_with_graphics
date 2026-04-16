import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from '../Entity/team.entity';
import { TeamStatus } from 'src/Entity/enums';
import { Player } from 'src/Entity/player.entity';

@Injectable()
export class TeamService {

  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    
  ) {}

  async create(data: Partial<Team>): Promise<Team> {
    try {
      const team = this.teamRepository.create(data); // single object (not array)
      return await this.teamRepository.save(team);
    } catch (err) {
      throw new InternalServerErrorException(err?.message || 'Failed to create team');
    }
  }

  async findAll(): Promise<Team[]> {
    try {
      return await this.teamRepository.find({ where: { status: TeamStatus.ACTIVE } });
    } catch (err) {
      throw new InternalServerErrorException(err?.message || 'Failed to load teams');
    }
  }

  async findOne(id: number): Promise<Team> {
    try {
      const team = await this.teamRepository.findOne({ where: { id } });
      if (!team) throw new NotFoundException('Team not found');
      return team;
    } catch (err) {
      // keep NotFound as-is
      throw err;
    }
  }

  async update(id: number, data: Partial<Team>): Promise<Team> {
    try {
      await this.findOne(id);
      await this.teamRepository.update({ id }, data);
      return await this.findOne(id);
    } catch (err) {
      throw err;
    }
  }

  async remove(id: number): Promise<{ ok: true; message: string }> {
    try {
      await this.update(id, { status: TeamStatus.INACTIVE } as any);
      return { ok: true, message: 'Team deactivated successfully' };
    } catch (err) {
      throw err;
    }
  }

  async activate(id: number): Promise<{ ok: true; message: string }> {
    try {
      await this.update(id, { status: TeamStatus.ACTIVE } as any);
      return { ok: true, message: 'Team activated successfully' };
    } catch (err) {
      throw err;
    }
  }

 async teamWithPalyer(id?: number) {
  const teams = await this.teamRepository.find({
    where: id ? { id } : undefined,
    select: ['id', 'name', 'shortName', 'logo', 'status'], // adjust to your columns
    order: { id: 'ASC' },
  });

  const teamData = await Promise.all(
    teams.map(async (t) => {
      const players = await this.playerRepository
        .createQueryBuilder('player')
        .select([
          'player.id as player_id',
          'player.first_name as player_FN',
          'player.last_name as player_LN',
          'player.role as player_role',
          'player.shirtNo as player_shirtNo',
          'player.battingStyle as player_battingStyle',
          'player.bowlingStyle as player_bowlingStyle',
          'player.image as player_image',
          'player.isActive as player_status',
        ])
        .where('player.teamId = :teamId', { teamId: t.id })
        .orderBy('player.shirtNo', 'ASC')
        .getRawMany();

      return { ...t, players };
    })
  );

  return id ? (teamData[0] ?? null) : teamData;
}

}
