import {
  Entity, PrimaryGeneratedColumn, Column, Index,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { MatchFormat, MatchStatus, TossDecision } from './enums';

@Entity('matches')

export class Match {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 180 })
  title: string;

  @Column({ type: 'enum', enum: MatchFormat })
  format: MatchFormat;

  @Column({ type: 'int', nullable: true })
  poolId: number; // teams.id

  @Column({ type: 'int' })
  team1Id: number; // teams.id

  @Column({ type: 'int' })
  team2Id: number; // teams.id

  @Column({ type: 'varchar', length: 180, nullable: true })
  venue?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  umpire1?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  umpire2?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  referee?: string;

  @Column({ type: 'datetime', nullable: true })
  startTime?: Date;

  @Column({ type: 'enum', enum: MatchStatus, default: MatchStatus.SCHEDULED })
  status: MatchStatus;

  @Column({ type: 'int', nullable: true })
  oversLimit?: number;

  @Column({ type: 'int', default: 6 })
  ballsPerOver: number;

  // Toss
  @Column({ type: 'int', nullable: true })
  tossWinnerTeamId?: number; // teams.id

  @Column({ type: 'enum', enum: TossDecision, nullable: true })
  tossDecision?: TossDecision;

  // Result
  @Column({ type: 'int', nullable: true })
  winnerTeamId?: number; // teams.id

  @Column({ type: 'varchar', length: 200, nullable: true })
  resultText?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
