import { Entity, PrimaryGeneratedColumn, Column, Index, Unique } from 'typeorm';

@Entity('match_squad')
@Unique('UQ_match_squad_match_player', ['matchId', 'playerId'])
@Index('IDX_match_squad_match_team', ['matchId', 'teamId'])
@Index('IDX_match_squad_match', ['matchId'])
@Index('IDX_match_squad_team', ['teamId'])
@Index('IDX_match_squad_player', ['playerId'])
export class MatchSquad {
  @PrimaryGeneratedColumn()
  id: number;

  // matches.id
  @Column({ type: 'int' })
  matchId: number;

  // teams.id (team for THIS match)
  @Column({ type: 'int' })
  teamId: number;

  // players.id
  @Column({ type: 'int' })
  playerId: number;

  // 1 = selected in playing XI, 0 = bench
  @Column({ type: 'tinyint', default: 0 })
  isPlayingXI: boolean;

  @Column({ type: 'tinyint', default: 0 })
  isCaptain: boolean;
  

  @Column({ type: 'tinyint', default: 0 })
  isViceCaptain :boolean
  @Column({ type: 'tinyint', default: 0 })
  isWicketKeeper: boolean;

  // optional planned order (1,2,3...)
  @Column({ type: 'int', nullable: true })
  battingPos?: number;

  // soft enable/disable this row
  @Column({ type: 'tinyint', default: 1 })
  isActive: boolean;
}
