import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  Index, Unique
} from 'typeorm';
import { DeliveryKind } from './enums';

@Entity('deliveries')
@Unique('UQ_deliveries_innings_seq', ['inningsId', 'seq'])
@Index('IDX_deliveries_innings_over', ['inningsId', 'overNumber'])
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  @Index()
  inningsId: number; // innings.id

  // event sequence in innings (includes wide/no-ball as events)
  @Column({ type: 'int' })
  seq: number;

  @Column({ type: 'int' })
  overNumber: number; // 0-based

  @Column({ type: 'int' })
  ballIndex: number; // 0..ballsPerOver-1 for legal balls counter

  @Column({ type: 'enum', enum: DeliveryKind })
  kind: DeliveryKind;

  @Column({ type: 'tinyint', default: 1 })
  isLegal: boolean; // false for wide/no-ball

  // MatchSquad.id
  @Column({ type: 'int' })
  @Index()
  strikerSquadId: number;

  @Column({ type: 'int' })
  @Index()
  nonStrikerSquadId: number;

  @Column({ type: 'int' })
  @Index()
  bowlerSquadId: number;

  // runs breakdown
  @Column({ type: 'int', default: 0 })
  runsOffBat: number;

  @Column({ type: 'int', default: 0 })
  wideRuns: number;

  @Column({ type: 'int', default: 0 })
  noBallRuns: number;

  @Column({ type: 'int', default: 0 })
  byeRuns: number;

  @Column({ type: 'int', default: 0 })
  legByeRuns: number;

  @Column({ type: 'int', default: 0 })
  penaltyRuns: number;

  @Column({ type: 'int', default: 0 })
  total_runs: number;

  // quick symbol for graphics: "1","4","Wd","Nb+1","W" etc.
  @Column({ type: 'varchar', length: 20, nullable: true })
  symbol?: string;

  @Column({ type: 'int', nullable: true })
  wicketId?: number; // wickets.id

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  bowlingSpeed?: number;

  @Column({ type: 'int', nullable: true })
  shotAngle?: number;

  @Column({ type: 'int', nullable: true })
  shotDistance?: number;

  @Column({ type: 'enum', enum: ['POWERPLAY', 'MIDDLE', 'DEATH'], nullable: true })
  phase?: 'POWERPLAY' | 'MIDDLE' | 'DEATH';

  // undo/audit safe
  @Column({ type: 'tinyint', default: 0 })
  isVoided: boolean;

  @Column({ type: 'datetime', nullable: true })
  voidedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;
}
