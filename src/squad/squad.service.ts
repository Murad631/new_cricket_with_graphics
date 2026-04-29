// src/squad/squad.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { MatchSquad } from '../Entity/squad.entity';
import { Match } from '../Entity/match.entity';
import { Team } from '../Entity/team.entity';
import { Player } from '../Entity/player.entity';

@Injectable()
export class SquadService {
  constructor(
    @InjectRepository(MatchSquad) private readonly squadRepo: Repository<MatchSquad>,
    @InjectRepository(Match) private readonly matchRepo: Repository<Match>,
    @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
    @InjectRepository(Player) private readonly playerRepo: Repository<Player>,
  ) {}

  private async ensureMatch(matchId: number) {
    const match = await this.matchRepo.findOne({ where: { id: matchId } });
    if (!match) throw new NotFoundException('Match not found');
    return match;
  }

  private async ensureTeam(teamId: number) {
    const team = await this.teamRepo.findOne({ where: { id: teamId } });
    if (!team) throw new BadRequestException('Invalid teamId');
    return team;
  }

  private async ensurePlayer(playerId: number) {
    const player = await this.playerRepo.findOne({ where: { id: playerId } });
    if (!player) throw new BadRequestException('Invalid playerId');
    return player;
  }


  async create(matchId: number, data: any) {
    try {
      const match = await this.ensureMatch(matchId);

      const teamId = Number(data.teamId);
      const playerId = Number(data.playerId);

      if (!teamId || !playerId) throw new BadRequestException('teamId and playerId are required');

      // Team must be part of this match
      if (teamId !== match.team1Id && teamId !== match.team2Id) {
        throw new BadRequestException('teamId is not part of this match');
      }

      await this.ensureTeam(teamId);
      const player = await this.ensurePlayer(playerId);

      // Optional strict rule: player must belong to that team
      // If your players can play for other team in a match, comment this check
      if (player.teamId !== teamId) {
        throw new BadRequestException('Player does not belong to this team');
      }

     const rowData: DeepPartial<MatchSquad> = {
        matchId,
        teamId,
        playerId,
        isPlayingXI: data.isPlayingXI ? Boolean(Number(data.isPlayingXI)) : false,
        isCaptain: data.isCaptain ? Boolean(Number(data.isCaptain)) : false,
        isWicketKeeper: data.isWicketKeeper ? Boolean(Number(data.isWicketKeeper)) : false,
        // ✅ IMPORTANT: use undefined instead of null
        battingPos: data.battingPos !== undefined && data.battingPos !== '' ? Number(data.battingPos) : undefined,
        isActive: true,
        };

        const row = this.squadRepo.create(rowData);   // ✅ returns MatchSquad (not array)
        const saved = await this.squadRepo.save(row); // ✅ saved is MatchSquad
        return this.findOneWithJoins(matchId, saved.id);
    } catch (err) {
      // Duplicate entry (Unique matchId+playerId)
      if (String(err?.message || '').includes('Duplicate') || err?.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('This player is already added in this match squad');
      }
      throw err instanceof BadRequestException || err instanceof NotFoundException
        ? err
        : new InternalServerErrorException(err?.message || 'Failed to create squad row');
    }
  }

  // ✅ List squad with player + team info (LEFT JOIN)
  async findAllWithJoins(matchId: number, teamId?: number) {
    await this.ensureMatch(matchId);

    const qb = this.squadRepo
      .createQueryBuilder('ms')
      .leftJoin('players', 'p', 'p.id = ms.playerId')
      .leftJoin('teams', 't', 't.id = ms.teamId')
      .select([
        // match_squad
        'ms.id AS id',
        'ms.matchId AS matchId',
        'ms.teamId AS teamId',
        'ms.playerId AS playerId',
        'ms.isPlayingXI AS isPlayingXI',
        'ms.isCaptain AS isCaptain',
        'ms.isWicketKeeper AS isWicketKeeper',
        'ms.battingPos AS battingPos',
        'ms.isActive AS isActive',

        // player
        'p.first_name AS firstName',
        'p.last_name AS lastName',
        'p.role AS role',
        'p.shirtNo AS shirtNo',
        'p.image AS image',

        // team
        't.name AS teamName',
        't.shortName AS teamShortName',
        't.logo AS teamLogo',
      ])
      .where('ms.matchId = :matchId', { matchId });

    if (teamId) qb.andWhere('ms.teamId = :teamId', { teamId });

    // show only active by default
    qb.andWhere('ms.isActive = 1');

    return qb.orderBy('ms.id', 'DESC').getRawMany();
  }

  // ✅ One squad row with joins
  async findOneWithJoins(matchId: number, id: number) {
    await this.ensureMatch(matchId);

    const row = await this.squadRepo
      .createQueryBuilder('ms')
      .leftJoin('players', 'p', 'p.id = ms.playerId')
      .leftJoin('teams', 't', 't.id = ms.teamId')
      .select([
        'ms.id AS id',
        'ms.matchId AS matchId',
        'ms.teamId AS teamId',
        'ms.playerId AS playerId',
        'ms.isPlayingXI AS isPlayingXI',
        'ms.isCaptain AS isCaptain',
        'ms.isWicketKeeper AS isWicketKeeper',
        'ms.battingPos AS battingPos',
        'ms.isActive AS isActive',

        'p.first_name AS firstName',
        'p.last_name AS lastName',
        'p.role AS role',
        'p.shirtNo AS shirtNo',
        'p.image AS image',

        't.name AS teamName',
        't.shortName AS teamShortName',
        't.logo AS teamLogo',
      ])
      .where('ms.matchId = :matchId', { matchId })
      .andWhere('ms.id = :id', { id })
      .getRawOne();

    if (!row) throw new NotFoundException('Squad row not found');
    return row;
  }

  // ✅ Update squad row (playingXI/captain/keeper/battingPos/teamId)
  async update(matchId: number, id: number, data: any) {
    try {
      const match = await this.ensureMatch(matchId);

      // ensure row exists
      const existing = await this.squadRepo.findOne({ where: { id, matchId } });
      if (!existing) throw new NotFoundException('Squad row not found');

      const payload: any = { ...data };

      // If updating teamId, verify team is in this match
      if (payload.teamId) {
        payload.teamId = Number(payload.teamId);
        if (payload.teamId !== match.team1Id && payload.teamId !== match.team2Id) {
          throw new BadRequestException('teamId is not part of this match');
        }
        await this.ensureTeam(payload.teamId);
      }

      if (payload.playerId) {
        payload.playerId = Number(payload.playerId);
        await this.ensurePlayer(payload.playerId);
      }

      // normalize booleans coming from form-data / json
      if (payload.isPlayingXI !== undefined) payload.isPlayingXI = Boolean(Number(payload.isPlayingXI));
      if (payload.isCaptain !== undefined) payload.isCaptain = Boolean(Number(payload.isCaptain));
      if (payload.isWicketKeeper !== undefined) payload.isWicketKeeper = Boolean(Number(payload.isWicketKeeper));
      if (payload.battingPos !== undefined) payload.battingPos = payload.battingPos === null ? null : Number(payload.battingPos);

      await this.squadRepo.update({ id, matchId }, payload);

      return this.findOneWithJoins(matchId, id);
    } catch (err) {
      if (String(err?.message || '').includes('Duplicate') || err?.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('This player is already added in this match squad');
      }
      throw err;
    }
  }

  async deactivate(matchId: number, id: number) {
    await this.ensureMatch(matchId);

    const existing = await this.squadRepo.findOne({ where: { id, matchId } });
    if (!existing) throw new NotFoundException('Squad row not found');

    await this.squadRepo.update({ id, matchId }, { isActive: false });
    return { ok: true, message: 'Squad player deactivated successfully' };
  }

  async activate(matchId: number, id: number) {
    await this.ensureMatch(matchId);

    const existing = await this.squadRepo.findOne({ where: { id, matchId } });
    if (!existing) throw new NotFoundException('Squad row not found');

    await this.squadRepo.update({ id, matchId }, { isActive: true });
    return { ok: true, message: 'Squad player activated successfully' };
  }


async matchSquadBothTeams(matchId: number) {
    const rows = await this.squadRepo
      .createQueryBuilder('ms')
      .innerJoin('matches', 'm', 'm.id = ms.matchId')
      .innerJoin('teams', 't', 't.id = ms.teamId')
      .innerJoin('players', 'p', 'p.id = ms.playerId')
      .select([
        'm.id as matchId',
        'ms.id as id',
        'm.title as matchTitle',
        'm.format as format',
        'm.venue as venue',
        'm.team1Id as team1Id',
        'm.team2Id as team2Id',

        't.id as teamId',
        't.name as teamName',
        't.shortName as teamShortName',
        't.logo as teamLogo',

        'ms.battingPos as battingPos',
        'ms.isCaptain as isCaptain',
        'ms.isViceCaptain as isViceCaptain',
        'ms.isWicketKeeper as isWicketKeeper',
        'ms.isPlayingXI as isPlayingXI',

        'p.id as playerId',
        'p.first_name as firstName',
        'p.last_name as lastName',
        'p.role as role',
        'p.shirtNo as shirtNo',
        'p.battingStyle as battingStyle',
        'p.bowlingStyle as bowlingStyle',
        'p.image as image',
      ])
      .where('ms.matchId = :matchId', { matchId })
      .andWhere('ms.isPlayingXI = 1')
      .orderBy('ms.teamId', 'ASC')
      .addOrderBy('ms.battingPos', 'ASC')
      .getRawMany();

    if (!rows.length) return null;

    const match = {
      matchId: Number(rows[0].matchId),
      title: rows[0].matchTitle,
      format: rows[0].format,
      venue: rows[0].venue,
      teams: [] as any[],
    };

    const teamMap = new Map<number, any>();

    for (const r of rows) {
      const teamId = Number(r.teamId);
      if (!teamMap.has(teamId)) {
        teamMap.set(teamId, {
          id: teamId,
          name: r.teamName,
          shortName: r.teamShortName,
          logo: r.teamLogo,
          playingXI: [],
        });
      }

      teamMap.get(teamId).playingXI.push({
        id: Number(r.id), // MatchSquad ID
        battingPos: r.battingPos != null ? Number(r.battingPos) : null,
        flags: {
          captain: !!Number(r.isCaptain),
          viceCaptain: !!Number(r.isViceCaptain),
          wicketKeeper: !!Number(r.isWicketKeeper),
        },
        player: {
          id: Number(r.playerId),
          name: `${r.firstName} ${r.lastName}`,
          role: r.role, // BAT/BOWL/ALL_ROUNDER/WK
          shirtNo: Number(r.shirtNo),
          battingStyle: r.battingStyle,
          bowlingStyle: r.bowlingStyle,
          image: r.image,
        },
      });
    }

    match.teams = Array.from(teamMap.values());
    return match;
  }

  //graphics

  async matchSquadSingleTeam(matchId: number, teamId: number) {
    const rows = await this.squadRepo
      .createQueryBuilder('ms')
      .innerJoin('teams', 't', 't.id = ms.teamId')
      .innerJoin('players', 'p', 'p.id = ms.playerId')
      .select([
        't.id as teamId',
        't.name as teamName',
        't.shortName as teamShortName',
        't.logo as teamLogo',

        'ms.battingPos as battingPos',
        'ms.isCaptain as isCaptain',
        'ms.isViceCaptain as isViceCaptain',
        'ms.isWicketKeeper as isWicketKeeper',

        'p.id as playerId',
        'p.first_name as firstName',
        'p.last_name as lastName',
        'p.role as role',
        'p.shirtNo as shirtNo',
        'p.battingStyle as battingStyle',
        'p.bowlingStyle as bowlingStyle',
        'p.image as image',
      ])
      .where('ms.matchId = :matchId', { matchId })
      .andWhere('ms.teamId = :teamId', { teamId })
      .andWhere('ms.isPlayingXI = 1')
      .orderBy('ms.battingPos', 'ASC')
      .getRawMany();

    if (!rows.length) return null;

    return {
      team: {
        id: Number(rows[0].teamId),
        name: rows[0].teamName,
        shortName: rows[0].teamShortName,
        logo: rows[0].teamLogo,
      },
      playingXI: rows.map((r) => ({
        battingPos: r.battingPos != null ? Number(r.battingPos) : null,
        flags: {
          captain: !!Number(r.isCaptain),
          viceCaptain: !!Number(r.isViceCaptain),
          wicketKeeper: !!Number(r.isWicketKeeper),
        },
        player: {
          id: Number(r.playerId),
          name: `${r.firstName} ${r.lastName}`,
          role: r.role,
          shirtNo: Number(r.shirtNo),
          battingStyle: r.battingStyle,
          bowlingStyle: r.bowlingStyle,
          image: r.image,
        },
      })),
    };
  }


}
