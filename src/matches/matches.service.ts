// src/match/match.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../Entity/match.entity';
import { Team } from '../Entity/team.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match) private readonly matchRepo: Repository<Match>,
    @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
  ) { }

  private async ensureTeam(teamId: number) {
    const t = await this.teamRepo.findOne({ where: { id: teamId } });
    if (!t) throw new BadRequestException(`Invalid teamId: ${teamId}`);
  }

  async create(data: Partial<Match>) {
    try {
      if (!data.team1Id || !data.team2Id) {
        throw new BadRequestException('team1Id and team2Id are required');
      }
      const team1Id = Number(data.team1Id);
      const team2Id = Number(data.team2Id);

      if (team1Id === team2Id) {
        throw new BadRequestException('team1Id and team2Id must be different');
      }

      await this.ensureTeam(team1Id);
      await this.ensureTeam(team2Id);

      // optional: validate toss/winner team ids if provided
      if (data.tossWinnerTeamId) await this.ensureTeam(Number(data.tossWinnerTeamId));
      if (data.winnerTeamId) await this.ensureTeam(Number(data.winnerTeamId));

      const match = this.matchRepo.create({
        ...data,
        team1Id,
        team2Id,
        oversLimit: data.oversLimit !== undefined ? Number(data.oversLimit) : null,
        ballsPerOver: data.ballsPerOver !== undefined ? Number(data.ballsPerOver) : 6,
        tossWinnerTeamId: data.tossWinnerTeamId ? Number(data.tossWinnerTeamId) : null,
        winnerTeamId: data.winnerTeamId ? Number(data.winnerTeamId) : null,
      } as any);

      return await this.matchRepo.save(match);
    } catch (err) {
      throw err instanceof BadRequestException ? err : new InternalServerErrorException(err?.message || 'Error creating match');
    }
  }

  async findOne(id: number): Promise<Match> {
    const match = await this.matchRepo.findOne({ where: { id } });
    if (!match) throw new NotFoundException('Match not found');
    return match;
  }

  // ✅ LIST with all team joins
  async findAllWithTeams(): Promise<any[]> {
    try {
      return await this.matchRepo
        .createQueryBuilder('m')
        .leftJoin('teams', 't1', 't1.id = m.team1Id')
        .leftJoin('teams', 't2', 't2.id = m.team2Id')
        .leftJoin('teams', 'tw', 'tw.id = m.tossWinnerTeamId')
        .leftJoin('teams', 'win', 'win.id = m.winnerTeamId')
        .select([
          // match
          'm.id AS id',
          'm.title AS title',
          'm.format AS format',
          'm.team1Id AS team1Id',
          'm.team2Id AS team2Id',
          'm.venue AS venue',
          'm.startTime AS startTime',
          'm.status AS status',
          'm.oversLimit AS oversLimit',
          'm.ballsPerOver AS ballsPerOver',
          'm.tossWinnerTeamId AS tossWinnerTeamId',
          'm.tossDecision AS tossDecision',
          'm.winnerTeamId AS winnerTeamId',
          'm.resultText AS resultText',
          'm.createdAt AS createdAt',
          'm.updatedAt AS updatedAt',

          // team1 details
          't1.id AS team1_id',
          't1.name AS team1_name',
          't1.shortName AS team1_shortName',
          't1.logo AS team1_logo',

          // team2 details
          't2.id AS team2_id',
          't2.name AS team2_name',
          't2.shortName AS team2_shortName',
          't2.logo AS team2_logo',

          // toss winner details
          'tw.id AS toss_team_id',
          'tw.name AS toss_team_name',
          'tw.shortName AS toss_team_shortName',
          'tw.logo AS toss_team_logo',

          // match winner details
          'win.id AS winner_team_id',
          'win.name AS winner_team_name',
          'win.shortName AS winner_team_shortName',
          'win.logo AS winner_team_logo',
        ])
        .orderBy('m.id', 'DESC')
        .getRawMany();
    } catch (err) {
      throw new InternalServerErrorException(err?.message || 'Error fetching matches');
    }
  }

  // ✅ SINGLE with all team joins
  async findOneWithTeams(id: number): Promise<any> {
    const row = await this.matchRepo
      .createQueryBuilder('m')
      .leftJoin('teams', 't1', 't1.id = m.team1Id')
      .leftJoin('teams', 't2', 't2.id = m.team2Id')
      .leftJoin('teams', 'tw', 'tw.id = m.tossWinnerTeamId')
      .leftJoin('teams', 'win', 'win.id = m.winnerTeamId')
      .select([
        // match
        'm.id AS id',
        'm.title AS title',
        'm.format AS format',
        'm.team1Id AS team1Id',
        'm.team2Id AS team2Id',
        'm.venue AS venue',
        'm.startTime AS startTime',
        'm.status AS status',
        'm.oversLimit AS oversLimit',
        'm.ballsPerOver AS ballsPerOver',
        'm.tossWinnerTeamId AS tossWinnerTeamId',
        'm.tossDecision AS tossDecision',
        'm.winnerTeamId AS winnerTeamId',
        'm.resultText AS resultText',
        'm.createdAt AS createdAt',
        'm.updatedAt AS updatedAt',

        // team1 details
        't1.id AS team1_id',
        't1.name AS team1_name',
        't1.shortName AS team1_shortName',
        't1.logo AS team1_logo',

        // team2 details
        't2.id AS team2_id',
        't2.name AS team2_name',
        't2.shortName AS team2_shortName',
        't2.logo AS team2_logo',

        // toss winner details
        'tw.id AS toss_team_id',
        'tw.name AS toss_team_name',
        'tw.shortName AS toss_team_shortName',
        'tw.logo AS toss_team_logo',

        // match winner details
        'win.id AS winner_team_id',
        'win.name AS winner_team_name',
        'win.shortName AS winner_team_shortName',
        'win.logo AS winner_team_logo',
      ])
      .where('m.id = :id', { id })
      .getRawOne();

    if (!row) throw new NotFoundException('Match not found');
    return row;
  }

  async update(id: number, data: Partial<Match>): Promise<any> {
    try {
      await this.findOne(id);

      // validate team ids if provided
      if (data.team1Id) await this.ensureTeam(Number(data.team1Id));
      if (data.team2Id) await this.ensureTeam(Number(data.team2Id));
      if (data.tossWinnerTeamId) await this.ensureTeam(Number(data.tossWinnerTeamId));
      if (data.winnerTeamId) await this.ensureTeam(Number(data.winnerTeamId));

      // prevent same team
      if (data.team1Id && data.team2Id && Number(data.team1Id) === Number(data.team2Id)) {
        throw new BadRequestException('team1Id and team2Id must be different');
      }

      // convert form-data strings -> numbers
      const payload: any = { ...data };
      if (payload.team1Id) payload.team1Id = Number(payload.team1Id);
      if (payload.team2Id) payload.team2Id = Number(payload.team2Id);
      if (payload.oversLimit !== undefined && payload.oversLimit !== null) payload.oversLimit = Number(payload.oversLimit);
      if (payload.ballsPerOver !== undefined && payload.ballsPerOver !== null) payload.ballsPerOver = Number(payload.ballsPerOver);
      if (payload.tossWinnerTeamId) payload.tossWinnerTeamId = Number(payload.tossWinnerTeamId);
      if (payload.winnerTeamId) payload.winnerTeamId = Number(payload.winnerTeamId);

      await this.matchRepo.update({ id }, payload);
      return this.findOneWithTeams(id);
    } catch (err) {
      throw err;
    }
  }

  async remove(id: number): Promise<{ ok: true; message: string }> {
    await this.findOne(id);
    await this.matchRepo.delete({ id });
    return { ok: true, message: 'Match deleted successfully' };
  }


  //Graphics 

    async listMatchesWithTeamsAndCaptains(match_id?: number) {
    const qb = this.matchRepo
      .createQueryBuilder('m')
      .leftJoin('teams', 't1', 't1.id = m.team1Id')
      .leftJoin('teams', 't2', 't2.id = m.team2Id')

      // captain team1
      .leftJoin(
        'match_squad',
        'ms1',
        'ms1.matchId = m.id AND ms1.teamId = m.team1Id AND ms1.isCaptain = 1',
      )
      .leftJoin('players', 'c1', 'c1.id = ms1.playerId')

      // captain team2
      .leftJoin(
        'match_squad',
        'ms2',
        'ms2.matchId = m.id AND ms2.teamId = m.team2Id AND ms2.isCaptain = 1',
      )
      .leftJoin('players', 'c2', 'c2.id = ms2.playerId')

      // pool + type (for tournament filtering)
      .leftJoin('pools', 'p', 'p.id = m.poolId')
      .leftJoin('type', 'ty', 'ty.id = p.type_id')

      .select([
        'm.id as matchId',
        'm.title as title',
        'm.format as format',
        'm.venue as venue',
        'm.startTime as startTime',
        'm.status as status',
        'm.oversLimit as oversLimit',
        'm.ballsPerOver as ballsPerOver',
        'm.poolId as poolId',
        'p.pool_name as poolName',
        'ty.id as typeId',
        'ty.name as typeName',

        't1.id as team1_id',
        't1.name as team1_name',
        't1.shortName as team1_shortName',
        't1.logo as team1_logo',
        't1.primaryColor as team1_primaryColor',
        't1.secondaryColor as team1_secondaryColor',

        't2.id as team2_id',
        't2.name as team2_name',
        't2.shortName as team2_shortName',
        't2.logo as team2_logo',
        't2.primaryColor as team2_primaryColor',
        't2.secondaryColor as team2_secondaryColor',

        // captain info
        'c1.id as team1_captainId',
        'c1.first_name as team1_captainFirstName',
        'c1.last_name as team1_captainLastName',
        'c1.role as team1_captainRole',
        'c1.image as team1_captainImage',

        'c2.id as team2_captainId',
        'c2.first_name as team2_captainFirstName',
        'c2.last_name as team2_captainLastName',
        'c2.role as team2_captainRole',
        'c2.image as team2_captainImage',
      ])
      .orderBy('m.id', 'ASC');

      if (match_id) {
        qb.where('m.id = :id', { id: match_id });
      }
    const rows = await qb.getRawMany();

    // make it "professional" JSON shape
    return rows.map((r) => ({
      matchId: Number(r.matchId),
      title: r.title,
      format: r.format,
      venue: r.venue,
      startTime: r.startTime,
      status: r.status,
      oversLimit: r.oversLimit,
      ballsPerOver: r.ballsPerOver,
      pool: r.poolId
        ? { id: Number(r.poolId), name: r.poolName, type: { id: Number(r.typeId), name: r.typeName } }
        : null,
      team1: {
        id: Number(r.team1_id),
        name: r.team1_name,
        shortName: r.team1_shortName,
        logo: r.team1_logo,
        primaryColor: r.team1_primaryColor,
        secondaryColor: r.team1_secondaryColor,
        captain: r.team1_captainId
          ? {
              id: Number(r.team1_captainId),
              name: `${r.team1_captainFirstName} ${r.team1_captainLastName}`,
              role: r.team1_captainRole,
              image: r.team1_captainImage,
            }
          : null,
      },
      team2: {
        id: Number(r.team2_id),
        name: r.team2_name,
        shortName: r.team2_shortName,
        logo: r.team2_logo,
        primaryColor: r.team2_primaryColor,
        secondaryColor: r.team2_secondaryColor,
        captain: r.team2_captainId
          ? {
              id: Number(r.team2_captainId),
              name: `${r.team2_captainFirstName} ${r.team2_captainLastName}`,
              role: r.team2_captainRole,
              image: r.team2_captainImage,
            }
          : null,
      },
    }));
  }


  //tournment Ovre view 

   async overview(typeId: number) {
    // Type + Pools + Teams
    const poolRows = await this.matchRepo.manager
      .createQueryBuilder()
      .select([
        'ty.id as typeId',
        'ty.name as typeName',

        'p.pool_name as poolName',
        't.id as teamId',
        't.name as teamName',
        't.shortName as teamShortName',
        't.logo as teamLogo',
        't.status as teamStatus',
      ])
      .from('type', 'ty')
      .innerJoin('pools', 'p', 'p.type_id = ty.id')
      .innerJoin('teams', 't', 't.id = p.team_id')
      .where('ty.id = :typeId', { typeId })
      .andWhere('p.isActive = 1')
      .orderBy('p.pool_name', 'ASC')
      .addOrderBy('t.id', 'ASC')
      .getRawMany();

    if (!poolRows.length) return null;

    // Matches in those pools (using matches.poolId -> pools.id)
    const matchRows = await this.matchRepo
      .createQueryBuilder('m')
      .innerJoin('pools', 'p', 'p.id = m.poolId')
      .innerJoin('teams', 't1', 't1.id = m.team1Id')
      .innerJoin('teams', 't2', 't2.id = m.team2Id')
      .leftJoin('type', 'ty', 'ty.id = p.type_id')
      .select([
        'm.id as matchId',
        'm.title as title',
        'm.format as format',
        'm.venue as venue',
        'm.startTime as startTime',
        'm.status as status',
        'm.oversLimit as oversLimit',
        'm.ballsPerOver as ballsPerOver',

        'p.pool_name as poolName',

        't1.id as team1Id',
        't1.name as team1Name',
        't1.shortName as team1ShortName',
        't2.id as team2Id',
        't2.name as team2Name',
        't2.shortName as team2ShortName',
      ])
      .where('ty.id = :typeId', { typeId })
      .orderBy('p.pool_name', 'ASC')
      .addOrderBy('m.id', 'ASC')
      .getRawMany();

    // Build response
    const out = {
      type: { id: Number(poolRows[0].typeId), name: poolRows[0].typeName },
      pools: [] as any[],
    };

    const poolMap = new Map<string, any>();

    for (const r of poolRows) {
      const key = r.poolName; // 'A' or 'B'
      if (!poolMap.has(key)) {
        poolMap.set(key, { name: key, teams: [], matches: [] });
      }
      poolMap.get(key).teams.push({
        id: Number(r.teamId),
        name: r.teamName,
        shortName: r.teamShortName,
        logo: r.teamLogo,
        status: r.teamStatus,
      });
    }

    for (const m of matchRows) {
      const key = m.poolName;
      if (!poolMap.has(key)) continue;
      poolMap.get(key).matches.push({
        id: Number(m.matchId),
        title: m.title,
        format: m.format,
        venue: m.venue,
        startTime: m.startTime,
        status: m.status,
        oversLimit: m.oversLimit,
        ballsPerOver: m.ballsPerOver,
        team1: { id: Number(m.team1Id), name: m.team1Name, shortName: m.team1ShortName },
        team2: { id: Number(m.team2Id), name: m.team2Name, shortName: m.team2ShortName },
      });
    }

    out.pools = Array.from(poolMap.values());
    return out;
  }

  async getTeamsByMatchId(matchId: number) {
    const match = await this.matchRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('teams','team1','m.team1Id = team1.id')
      .leftJoinAndSelect('teams','team2','m.team2Id = team2.id')
      .where('m.id = :matchId', { matchId })
      .select([
        'team1.id as team1_id',
        'team1.name as team1_name',
        'team2.id as team2_id',
        'team2.name as team2_name',
      ])
      .getRawOne();

    if (!match) {
      return null;
    }

    return {
      matchId: matchId,
      team1: {
        id: match.team1_id,
        name: match.team1_name,
      },
      team2: {
        id: match.team2_id,
        name: match.team2_name,
      },
    };
  }

}
