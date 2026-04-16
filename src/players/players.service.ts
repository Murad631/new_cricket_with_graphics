import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from '../Entity/player.entity';


@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  // Create a new player
  async create(data: Partial<Player>, logo?: Express.Multer.File): Promise<Player> {
    try {
      if (logo) data.image = logo.path; // If logo is provided, store it
      const player = this.playerRepository.create(data);
      return await this.playerRepository.save(player);
    } catch (err) {
      throw new InternalServerErrorException('Error creating player: ' + err.message);
    }
  }

  // Get all players
  async findAll(): Promise<any[]> {
  try {
    return await this.playerRepository
      .createQueryBuilder('p')
      .leftJoin('teams', 't', 't.id = p.teamId')
      .select([
        'p.id AS id',
        'p.teamId AS teamId',
        'p.firstName AS firstName',
        'p.lastName AS lastName',
        'p.role AS role',
        'p.shirtNo AS shirtNo',
        'p.dateOfBirth AS dateOfBirth',
        'p.battingStyle AS battingStyle',
        'p.bowlingStyle AS bowlingStyle',
        'p.noOfMatches AS noOfMatches',
        'p.strikeRate AS strikeRate',
        'p.image AS image',
        'p.isActive AS isActive',
        'p.createdAt AS createdAt',
        'p.updatedAt AS updatedAt',

        't.id AS team_id',
        't.name AS team_name',
        't.shortName AS team_shortName',
        't.logo AS team_logo',
      ])
      .where('p.isActive = :isActive', { isActive: true })
      .orderBy('p.id', 'DESC')
      .getRawMany();
  } catch (err) {
    throw new InternalServerErrorException('Error fetching players: ' + err.message);
  }
}

  // Find player by ID
  async findOne(id: number): Promise<any> {
  const row = await this.playerRepository
    .createQueryBuilder('p')
    .leftJoin('teams', 't', 't.id = p.teamId')
    .select([
      'p.id AS id',
      'p.teamId AS teamId',
      'p.firstName AS firstName',
      'p.lastName AS lastName',
      'p.role AS role',
      'p.shirtNo AS shirtNo',
      'p.dateOfBirth AS dateOfBirth',
      'p.battingStyle AS battingStyle',
      'p.bowlingStyle AS bowlingStyle',
      'p.noOfMatches AS noOfMatches',
      'p.strikeRate AS strikeRate',
      'p.image AS image',
      'p.isActive AS isActive',
      'p.createdAt AS createdAt',
      'p.updatedAt AS updatedAt',

      't.id AS team_id',
      't.name AS team_name',
      't.shortName AS team_shortName',
      't.logo AS team_logo',
    ])
    .where('p.id = :id', { id })
    .getRawOne();

  if (!row) throw new NotFoundException('Player not found');
  return row;
}


  // Update player (update logo if provided)
  async update(id: number, data: Partial<Player>, logo?: Express.Multer.File): Promise<Player> {
    try {
      await this.findOne(id);  // Ensure player exists
      if (logo) data.image = logo.path; // Update logo if a new file is uploaded
      await this.playerRepository.update({ id }, data);
      return this.findOne(id);  // Return the updated player
    } catch (err) {
      throw err; // Let NotFoundException propagate
    }
  }

  // Deactivate player (soft delete)
  async deactivate(id: number): Promise<{ message: string }> {
    try {
      await this.update(id, { isActive: false });
      return { message: 'Player deactivated successfully' };
    } catch (err) {
      throw new InternalServerErrorException('Error deactivating player: ' + err.message);
    }
  }

  // Activate player
  async activate(id: number): Promise<{ message: string }> {
    try {
      await this.update(id, { isActive: true });
      return { message: 'Player activated successfully' };
    } catch (err) {
      throw new InternalServerErrorException('Error activating player: ' + err.message);
    }
  }

  //graphics 

   private calcAge(dob?: string | Date | null): number | null {
    if (!dob) return null;
    const d = typeof dob === 'string' ? new Date(dob) : dob;
    if (Number.isNaN(d.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
    return age >= 0 ? age : null;
  }


    async playerLowerThird(playerId: number, matchId?: number) {
    const qb = this.playerRepository
      .createQueryBuilder('p')
      .leftJoin('teams', 't', 't.id = p.teamId')
      .select([
        'p.id as playerId',
        'p.teamId as teamId',
        'p.first_name as firstName',
        'p.last_name as lastName',
        'p.role as role',
        'p.shirtNo as shirtNo',
        'p.dateOfBirth as dateOfBirth',
        'p.battingStyle as battingStyle',
        'p.bowlingStyle as bowlingStyle',
        'p.no_of_matches as noOfMatches',
        'p.strike_rate as strikeRate',
        'p.image as image',
        'p.isActive as isActive',

        't.name as teamName',
        't.shortName as teamShortName',
        't.logo as teamLogo',
        't.primaryColor as teamPrimaryColor',
        't.secondaryColor as teamSecondaryColor',
        't.status as teamStatus',
      ])
      .where('p.id = :playerId', { playerId })
      .limit(1);

    // Optional: include match context (position/captain/VC/WK flags)
    if (matchId) {
      qb.leftJoin(
        'match_squad',
        'ms',
        'ms.playerId = p.id AND ms.matchId = :matchId',
        { matchId },
      );

      qb.addSelect([
        'ms.matchId as matchId',
        'ms.teamId as matchTeamId',
        'ms.isPlayingXI as isPlayingXI',
        'ms.isCaptain as isCaptain',
        // IMPORTANT: add this column in DB + entity if you want VC.
        'ms.isViceCaptain as isViceCaptain',
        'ms.isWicketKeeper as isWicketKeeper',
        'ms.battingPos as battingPos',
      ]);
    }

    const r = await qb.getRawOne();
    if (!r) return null;

    const fullName = `${(r.firstName ?? '').trim()} ${(r.lastName ?? '').trim()}`.trim();
    const age = this.calcAge(r.dateOfBirth);

    const matchContext =
      matchId && r.matchId
        ? {
            matchId: Number(r.matchId),
            teamId: r.matchTeamId != null ? Number(r.matchTeamId) : null,
            isPlayingXI: !!Number(r.isPlayingXI ?? 0),
            isCaptain: !!Number(r.isCaptain ?? 0),
            isViceCaptain: !!Number(r.isViceCaptain ?? 0),
            isWicketKeeper: !!Number(r.isWicketKeeper ?? 0),
            battingPos: r.battingPos != null ? Number(r.battingPos) : null,
          }
        : null;

    // "Lower third" style payload for professional broadcast UI
    return {
      player: {
        id: Number(r.playerId),
        name: fullName || null,
        firstName: r.firstName ?? null,
        lastName: r.lastName ?? null,
        image: r.image ?? null,
        role: r.role ?? null,          // BAT/BOWL/ALL_ROUNDER/WK
        shirtNo: r.shirtNo != null ? Number(r.shirtNo) : null,
        age,
        battingStyle: r.battingStyle ?? null,
        bowlingStyle: r.bowlingStyle ?? null,
        stats: {
          matches: r.noOfMatches != null ? Number(r.noOfMatches) : 0,
          strikeRate: r.strikeRate != null ? Number(r.strikeRate) : 0,
          // Future-proof placeholders (when you add results tables)
          runs: null,
          wickets: null,
          average: null,
          economy: null,
        },
        isActive: !!Number(r.isActive ?? 0),
      },
      team: {
        id: Number(r.teamId),
        name: (r.teamName ?? '').trim() || null,
        shortName: r.teamShortName ?? null,
        logo: r.teamLogo ?? null,
        primaryColor: r.teamPrimaryColor ?? null,
        secondaryColor: r.teamSecondaryColor ?? null,
        status: r.teamStatus ?? null,
      },
      matchContext, // null if matchId not provided OR player not in that match
      lowerThird: {
        headline: `${fullName || 'Player'} • ${r.teamShortName || 'TEAM'}`,
        subhead: [
          r.role ? `Role: ${r.role}` : null,
          age != null ? `Age: ${age}` : null,
          r.noOfMatches != null ? `Matches: ${Number(r.noOfMatches)}` : null,
          r.strikeRate != null ? `SR: ${Number(r.strikeRate).toFixed(2)}` : null,
        ].filter(Boolean),
        flags: matchContext
          ? {
              captain: matchContext.isCaptain,
              viceCaptain: matchContext.isViceCaptain,
              wicketKeeper: matchContext.isWicketKeeper,
              battingPos: matchContext.battingPos,
            }
          : null,
      },
    };
  }
}
