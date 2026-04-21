import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Match } from '../Entity/match.entity';
import { Team } from '../Entity/team.entity';
import { MatchBatting } from '../Entity/match_betting.entity';
import { OverSummary } from '../Entity/over_summary.entity';
import { ScoreboardState } from '../Entity/scoreboard_stat.entity';
import { Delivery } from '../Entity/deliveries.entity';
import { Wicket } from '../Entity/wicket.entity';
import { MatchSquad } from '../Entity/squad.entity';
import { Player } from '../Entity/player.entity';
import { Innings } from '../Entity/inning.entity';
import { Sponsor } from '../Entity/sponsor.entity';
import { SponsorLog } from '../Entity/sponsor_log.entity';
import { PitchReport } from '../Entity/pitch_report.entity';
import { DeliveryKind, MatchStatus, WicketType } from '../Entity/enums';

@Injectable()
export class GraphicsService {
  constructor(
    @InjectRepository(Match) private matchRepo: Repository<Match>,
    @InjectRepository(Team) private teamRepo: Repository<Team>,
    @InjectRepository(MatchBatting) private matchBattingRepo: Repository<MatchBatting>,
    @InjectRepository(OverSummary) private overSummaryRepo: Repository<OverSummary>,
    @InjectRepository(ScoreboardState) private scoreboardStateRepo: Repository<ScoreboardState>,
    @InjectRepository(Delivery) private deliveryRepo: Repository<Delivery>,
    @InjectRepository(Wicket) private wicketRepo: Repository<Wicket>,
    @InjectRepository(MatchSquad) private matchSquadRepo: Repository<MatchSquad>,
    @InjectRepository(Player) private playerRepo: Repository<Player>,
    @InjectRepository(Innings) private inningsRepo: Repository<Innings>,
    @InjectRepository(Sponsor) private sponsorRepo: Repository<Sponsor>,
    @InjectRepository(SponsorLog) private sponsorLogRepo: Repository<SponsorLog>,
    @InjectRepository(PitchReport) private pitchReportRepo: Repository<PitchReport>,
  ) { }

  // ==========================================
  // --- MASTER TRUTH ENGINE (DERIVATIVE) ---
  // ==========================================

  private async getInningsDerivative(inningsId: number) {
    const deliveries = await this.deliveryRepo.find({
      where: { inningsId, isVoided: false },
      order: { seq: 'ASC' }
    });
    const allWickets = await this.wicketRepo.find({ where: { inningsId } });

    const derivative = {
      totalRuns: 0,
      totalWickets: 0,
      totalLegalBalls: 0,
      extras: { wide: 0, noball: 0, bye: 0, legbye: 0, penalty: 0, total: 0 },
      batters: new Map<number, { runs: number, balls: number, fours: number, sixes: number }>(),
      bowlers: new Map<number, { runs: number, wickets: number, balls: number, dots: number }>(),
      fow: [] as Array<{ wicketNumber: number, score: number, overs: string, outBatsmanSquadId: number }>
    };

    deliveries.forEach((d) => {
      derivative.totalRuns += (d.total_runs || 0);
      if (d.isLegal) derivative.totalLegalBalls++;

      derivative.extras.wide += (d.wideRuns || 0);
      derivative.extras.noball += (d.noBallRuns || 0);
      derivative.extras.bye += (d.byeRuns || 0);
      derivative.extras.legbye += (d.legByeRuns || 0);
      derivative.extras.penalty += (d.penaltyRuns || 0);

      if (d.strikerSquadId) {
        const b = derivative.batters.get(d.strikerSquadId) || { runs: 0, balls: 0, fours: 0, sixes: 0 };
        b.runs += (d.runsOffBat || 0);
        if (d.isLegal) b.balls++;
        if (d.runsOffBat === 4) b.fours++;
        if (d.runsOffBat === 6) b.sixes++;
        derivative.batters.set(d.strikerSquadId, b);
      }

      if (d.bowlerSquadId) {
        const bo = derivative.bowlers.get(d.bowlerSquadId) || { runs: 0, wickets: 0, balls: 0, dots: 0 };
        const conceded = (d.runsOffBat || 0) + (d.wideRuns || 0) + (d.noBallRuns || 0);
        bo.runs += conceded;
        if (d.isLegal) bo.balls++;
        if (conceded === 0) bo.dots++;
        if (d.wicketId) {
          const w = allWickets.find(wick => wick.id === d.wicketId);
          if (w && w.type !== WicketType.RUN_OUT) bo.wickets++;
        }
        derivative.bowlers.set(d.bowlerSquadId, bo);
      }

      if (d.wicketId) {
        derivative.totalWickets++;
        derivative.fow.push({
          wicketNumber: derivative.totalWickets,
          score: derivative.totalRuns,
          overs: `${Math.floor(derivative.totalLegalBalls / 6)}.${derivative.totalLegalBalls % 6}`,
          outBatsmanSquadId: d.strikerSquadId || 0
        });
      }
    });

    derivative.extras.total = (derivative.extras.wide || 0) + (derivative.extras.noball || 0) + (derivative.extras.bye || 0) + (derivative.extras.legbye || 0) + (derivative.extras.penalty || 0);
    return derivative;
  }

  // ==========================================
  // --- PHASE 1 & 2 GRAPHICS (REFACTORED) ---
  // ==========================================

  async getAllMatches() {
    const matches = await this.matchRepo.find();
    if (!matches.length) return [];
    const teams = await this.teamRepo.find();
    const teamMap = new Map(teams.map(t => [t.id, t]));
    return matches.map(m => ({
      id: m.id, title: m.title, status: m.status, startTime: m.startTime,
      team1: teamMap.get(m.team1Id) || null, team2: teamMap.get(m.team2Id) || null,
    }));
  }

  async getPlayerName(squadId: number | undefined | null): Promise<string> {
    if (!squadId) return '';
    const squad = await this.matchSquadRepo.findOne({ where: { id: squadId } });
    if (!squad) return '';
    const player = await this.playerRepo.findOne({ where: { id: squad.playerId } });
    if (!player) return '';
    return player.lastName ? `${player.firstName.charAt(0)} ${player.lastName}` : player.firstName;
  }

  async getPlayerDetails(squadId: number | undefined | null): Promise<{ name: string, image: string }> {
    if (!squadId) return { name: '', image: '' };
    const squad = await this.matchSquadRepo.findOne({ where: { id: squadId } });
    if (!squad) return { name: '', image: '' };
    const player = await this.playerRepo.findOne({ where: { id: squad.playerId } });
    if (!player) return { name: '', image: '' };
    return { name: player.firstName + ' ' + (player.lastName || ''), image: player.image || '' };
  }

  async getBattingCard(matchId: number) {
    const state = await this.scoreboardStateRepo.findOne({ where: { matchId } });
    if (!state || !state.currentInningsId) return { status: 'error', message: 'No active state' };
    const truth = await this.getInningsDerivative(state.currentInningsId);
    const strikers = [state.strikerSquadId, state.nonStrikerSquadId].filter(id => !!id) as number[];
    const batters = await Promise.all(strikers.map(async id => {
      const stats = truth.batters.get(id) || { runs: 0, balls: 0, fours: 0, sixes: 0 };
      return {
        player_id: id, playerName: await this.getPlayerName(id),
        runs: stats.runs, balls: stats.balls, fours: stats.fours, sixes: stats.sixes,
        strikeRate: stats.balls > 0 ? ((stats.runs / stats.balls) * 100).toFixed(2) : "0.00",
        isStriker: id === state.strikerSquadId
      };
    }));
    return { type: 'update', graphic: 'batting_card', data: { scoreboard: { ...state, total_run: truth.totalRuns, total_wickets: truth.totalWickets, actualOvers: `${Math.floor(truth.totalLegalBalls / 6)}.${truth.totalLegalBalls % 6}` }, batters } };
  }

  async getBowlingPanel(matchId: number) {
    const state = await this.scoreboardStateRepo.findOne({ where: { matchId } });
    if (!state || !state.currentInningsId || !state.bowlerSquadId) return { status: 'error', message: 'No bowler' };
    const truth = await this.getInningsDerivative(state.currentInningsId);
    const stats = truth.bowlers.get(state.bowlerSquadId) || { runs: 0, wickets: 0, balls: 0, dots: 0 };
    return { type: 'update', graphic: 'bowling_panel', data: { scoreboard: state, currentBowler: { playerName: await this.getPlayerName(state.bowlerSquadId), overNumber: `${Math.floor(stats.balls / 6)}.${stats.balls % 6}`, runs: stats.runs, wickets: stats.wickets, dots: stats.dots } } };
  }

  async getFullScoreboard(matchId: number) {
    const state = await this.scoreboardStateRepo.findOne({ where: { matchId } });
    if (!state || !state.currentInningsId) return { status: 'error', message: 'No active state' };
    const truth = await this.getInningsDerivative(state.currentInningsId);
    return { type: 'update', graphic: 'full_scoreboard', data: { status: 'ok', scoreboard: { ...state, total_run: truth.totalRuns, total_wickets: truth.totalWickets, actualOvers: `${Math.floor(truth.totalLegalBalls / 6)}.${truth.totalLegalBalls % 6}` } } };
  }

  async getMatchSummary(matchId: number) {
    const match = await this.matchRepo.findOne({ where: { id: matchId } });
    const innings = await this.inningsRepo.find({ where: { matchId }, order: { number: 'ASC' } });
    const summary = await Promise.all(innings.map(async (inn) => {
      const team = await this.teamRepo.findOne({ where: { id: inn.battingTeamId } });
      const truth = await this.getInningsDerivative(inn.id);
      return { teamName: team?.name || 'Team', runs: truth.totalRuns, wickets: truth.totalWickets, overs: `${Math.floor(truth.totalLegalBalls / 6)}.${truth.totalLegalBalls % 6}` };
    }));
    return { type: 'update', graphic: 'match_summary', data: { matchTitle: match?.title, venue: match?.venue, innings: summary, result: match?.resultText || 'Match in Progress' } };
  }

  // ==========================================
  // --- PHASE 3: SPONSOR & CONTROL ---
  // ==========================================

  async listSponsors() { return await this.sponsorRepo.find({ order: { name: 'ASC' } }); }
  async createSponsor(data: Partial<Sponsor>) { return await this.sponsorRepo.save(this.sponsorRepo.create(data)); }
  async updateSponsor(id: number, data: Partial<Sponsor>) { await this.sponsorRepo.update(id, data); return await this.sponsorRepo.findOne({ where: { id } }); }
  async deleteSponsor(id: number) { return await this.sponsorRepo.delete(id); }

  async triggerSponsor(id: number) {
    const s = await this.sponsorRepo.findOne({ where: { id } });
    if (!s) return { status: 'error', message: 'Not found' };
    if (s.no_shown >= s.show_count && s.show_count > 0) return { status: 'error', message: 'Limit reached' };

    // Auto-detect the active innings from the most recent match state
    const state = await this.scoreboardStateRepo.findOne({ where: {}, order: { matchId: 'DESC' } });
    const inningsId = state ? state.currentInningsId : null;

    s.no_shown++;
    await this.sponsorRepo.save(s);

    if (inningsId) {
      await this.sponsorLogRepo.save(this.sponsorLogRepo.create({ sponsorId: s.id, inningsId }));
    }

    return { type: 'update', graphic: 'sponsor_bug', data: { header: s.header, image: s.image, tagline: s.tagline } };
  }

  async upsertPitchReport(data: Partial<PitchReport>) {
    let r = await this.pitchReportRepo.findOne({ where: { matchId: data.matchId, inningsId: data.inningsId } });
    if (r) Object.assign(r, data); else r = this.pitchReportRepo.create(data);
    return await this.pitchReportRepo.save(r);
  }

  async getPitchReport(matchId: number, inningsId: number) {
    return await this.pitchReportRepo.findOne({ where: { matchId, inningsId } });
  }

  async triggerPitchReport(matchId: number, inningsId: number) {
    const r = await this.getPitchReport(matchId, inningsId);
    return { type: 'update', graphic: 'pitch_report', data: r || {} };
  }

  async listMatches() { return await this.matchRepo.find({ order: { id: 'DESC' } }); }
  async listOvers(matchId: number, inningsId: number) {
    const fromSummary = await this.overSummaryRepo.find({ where: { matchId, inningsId }, order: { overNumber: 'ASC' } });
    if (fromSummary && fromSummary.length > 0) return fromSummary;

    // Fallback: If OverSummary is empty, find available overs from Deliveries
    const deliveries = await this.deliveryRepo.find({
      where: { inningsId, isVoided: false },
      select: ['overNumber'],
      order: { overNumber: 'ASC' }
    });

    if (!deliveries.length) return [];

    // Get unique over numbers and return them as minimal objects
    const uniqueOvers = Array.from(new Set(deliveries.map(d => d.overNumber)));
    return uniqueOvers.map(num => ({
      matchId,
      inningsId,
      overNumber: num,
      runs: 0, // Placeholder
      wickets: 0 // Placeholder
    }));
  }

  async triggerOverSummary(matchId: number, inningsId: number, overNumber: number) {
    // 1. Deliveries table is 0-based (Over 1 is overNumber 0 in DB)
    const dbOverIndex = overNumber - 1;

    const deliveries = await this.deliveryRepo.find({ 
      where: { inningsId, overNumber: dbOverIndex, isVoided: false }, 
      order: { seq: 'ASC' } 
    });

    if (!deliveries.length) {
       return { status: 'error', message: `No deliveries found for Over ${overNumber} (DB Index ${dbOverIndex})` };
    }

    // 2. Extract Balls and Sum ALL Runs (Bat + Extras) for total accuracy
    const balls = deliveries.map(d => d.symbol || d.total_runs.toString());
    const overRuns = deliveries.reduce((acc, d) => {
       return acc + (Number(d.runsOffBat) || 0) + 
                    (Number(d.wideRuns) || 0) + 
                    (Number(d.noBallRuns) || 0) + 
                    (Number(d.byeRuns) || 0) + 
                    (Number(d.legByeRuns) || 0) + 
                    (Number(d.penaltyRuns) || 0);
    }, 0);

    // 3. Find Bowler Name
    const bowlerSquadId = deliveries[0].bowlerSquadId;
    let bowlerName = "Bowler";
    const squadEntry = await this.matchSquadRepo.findOne({ where: { id: bowlerSquadId } });
    if (squadEntry) {
       const player = await this.playerRepo.findOne({ where: { id: squadEntry.playerId } });
       if (player) bowlerName = `${player.firstName} ${player.lastName}`;
    }

    // 4. Calculate Cumulative Match Score up to the END of this over
    const allInningsDeliveries = await this.deliveryRepo.find({ where: { inningsId, isVoided: false } });
    let totalInningsRuns = 0;
    let totalWickets = 0;
    allInningsDeliveries.forEach(d => {
       // All deliveries in current over and previous overs
       if (d.overNumber <= dbOverIndex) {
           totalInningsRuns += (Number(d.runsOffBat) || 0) + 
                               (Number(d.wideRuns) || 0) + 
                               (Number(d.noBallRuns) || 0) + 
                               (Number(d.byeRuns) || 0) + 
                               (Number(d.legByeRuns) || 0) + 
                               (Number(d.penaltyRuns) || 0);
           if (d.wicketId) totalWickets++;
       }
    });

    const payload = {
      type: 'update',
      graphic: 'over_summary',
      data: {
        matchId,
        inningsId,
        overNumber,
        headerTitle: `End of Over ${overNumber}`,
        balls: balls,
        runs: overRuns,
        bowlerName: bowlerName,
        totalScore: `${totalInningsRuns}/${totalWickets}`
      }
    };

    return payload;
  }

  async getPhaseSummary(matchId: number | undefined, inningsId: number | undefined, start: number = 0, end: number = 5, tag?: string) {
    if (!matchId || !inningsId) return { status: 'error', message: 'matchId and inningsId are required' };

    const deliveries = await this.deliveryRepo.find({ where: { inningsId, isVoided: false } });
    let r = 0, w = 0, b = 0;
    deliveries.forEach(d => {
      if (d.overNumber >= start && d.overNumber <= end) {
        r += (d.total_runs || 0);
        if (d.wicketId) w++;
        if (d.isLegal) b++;
      }
    });

    const match = await this.matchRepo.findOne({ where: { id: matchId } });
    const innings = await this.inningsRepo.findOne({ where: { id: inningsId } });
    const team = await this.teamRepo.findOne({ where: { id: innings?.battingTeamId || 0 } });

    const runRate = b > 0 ? ((r / b) * 6).toFixed(2) : "0.00";

    return {
      type: 'update',
      graphic: 'phase_summary',
      data: {
        matchId,
        inningsId,
        teamName: team?.name || 'Team',
        matchMeta: match ? `(${team?.name}) - ${match.venue}` : '',
        phaseName: tag ? `${tag} (${start}-${end})` : `OVERS ${start}-${end} SUMMARY`,
        runs: r,
        wickets: w,
        runRate: runRate,
        overs: `${Math.floor(b / 6)}.${b % 6}`
      }
    };
  }

  async triggerPhaseTag(type: string) {
    return { type: 'update', graphic: type === 'powerplay' ? 'power_play' : (type === 'superover' ? 'super_over' : 'free_hit'), data: { active: true } };
  }

  async getTopSixHitters() {
    // 1. Get stats grouped by player
    const stats = await this.deliveryRepo
      .createQueryBuilder('d')
      .select('d.strikerSquadId', 'squadId')
      .addSelect('COUNT(d.id)', 'sixes')
      .where('d.runsOffBat = :runs', { runs: 6 })
      .andWhere('d.isVoided = :void', { void: false })
      .groupBy('d.strikerSquadId')
      .orderBy('sixes', 'DESC')
      .limit(5)
      .getRawMany();

    // 2. Hydrate with player and team details
    const leaderboard = await Promise.all(stats.map(async (row, index) => {
      const squad = await this.matchSquadRepo.findOne({
        where: { id: row.squadId }
      });

      // Manual fetch if relations aren't setup in the Entity (safer based on previous view)
      let player: Player | null = null;
      let team: Team | null = null;
      
      if (squad) {
        player = await this.playerRepo.findOne({ where: { id: squad.playerId } });
        team = await this.teamRepo.findOne({ where: { id: squad.teamId } });
      }

      return {
        rank: index + 1,
        name: player ? `${player.firstName} ${player.lastName}` : 'Unknown',
        team: team ? team.shortName : 'UNK',
        flag: team ? team.logo : '',
        value: row.sixes,
        highlight: index === 0
      };
    }));

    return {
      type: 'update',
      graphic: 'leaderboard',
      data: {
        title: 'TOURNAMENT LEADERS',
        subtitle: 'MOST SIXES',
        list: leaderboard
      }
    };
  }

  async listAllMatches() {
    return await this.matchRepo.find({
      order: { id: 'DESC' },
      select: ['id', 'title', 'venue', 'startTime']
    });
  }

  async triggerMatchDetails(matchId: number) {
    const match = await this.matchRepo.findOne({ where: { id: matchId } });
    if (!match) return { status: 'error', message: 'Match not found' };

    const team1 = await this.teamRepo.findOne({ where: { id: match.team1Id } });
    const team2 = await this.teamRepo.findOne({ where: { id: match.team2Id } });

    // Toss construction
    let tossText = 'TOSS DETAILS NOT AVAILABLE';
    if (match.tossWinnerTeamId) {
      const winner = await this.teamRepo.findOne({ where: { id: match.tossWinnerTeamId } });
      if (winner) {
        tossText = `TOSS: ${winner.name} WON & ELECTED TO ${match.tossDecision || 'BAT'} FIRST`;
      }
    }

    return {
      type: 'update',
      graphic: 'match_details',
      data: {
        title: 'MATCH INFORMATION',
        tournament: 'ICC T20 WORLD CUP 2026',
        venue: match.venue || 'TBD',
        city: match.city || 'TBD',
        matchNo: `Match ${match.id}`,
        umpire1: match.umpire1 || 'TBD',
        umpire2: match.umpire2 || 'TBD',
        referee: match.referee || 'TBD',
        toss: tossText
      }
    };
  }

  async listTeams() {
    return await this.teamRepo.find({ order: { name: 'ASC' } });
  }

  async triggerPlayingXI(matchId: number, teamId: number) {
    const team = await this.teamRepo.findOne({ where: { id: teamId } });
    if (!team) return { status: 'error', message: 'Team not found' };

    const squadRepo = this.matchSquadRepo;
    const squadEntries = await squadRepo.find({
      where: { matchId, teamId, isPlayingXI: true, isActive: true },
      order: { battingPos: 'ASC' }
    });

    if (!squadEntries.length) return { status: 'error', message: 'No playing XI found' };

    const playersFull = await Promise.all(squadEntries.map(async (sq) => {
      const p = await this.playerRepo.findOne({ where: { id: sq.playerId } });
      let playerRole = (p?.role || 'PLAYER').replace(/_/g, ' ').toUpperCase();
      
      let roleTag = playerRole;
      if (sq.isCaptain) roleTag = `CAPTAIN • ${playerRole}`;
      else if (sq.isViceCaptain) roleTag = `VICE CAPTAIN • ${playerRole}`;
      
      if (sq.isWicketKeeper) roleTag = `${roleTag} • WK`;

      return {
        name: p ? `${p.firstName} ${p.lastName}`.toUpperCase() : 'UNKNOWN',
        role: roleTag,
        img: p?.image || 'https://static.cricinfo.com/db/PICTURES/CMS/316600/316605.png',
        isCaptain: sq.isCaptain,
        pos: sq.battingPos || 0
      };
    }));

    const captain = playersFull.find(p => p.isCaptain) || playersFull[0];
    const others = playersFull.filter(p => p !== captain).slice(0, 10);

    return {
      type: 'update',
      graphic: 'playing_xi',
      data: {
        teamName: `${team.name.toUpperCase()} SQUAD`,
        teamLogo: team.logo,
        captain: {
          name: captain.name,
          role: captain.role,
          img: captain.img,
          pos: captain.pos
        },
        players: others.map((p, i) => ({
          name: p.name,
          role: p.role,
          img: p.img,
          order: p.pos || (i + 2) // showing batting position or sequential
        }))
      }
    };
  }
}
