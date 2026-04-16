// src/entity/over-summary.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('match_batting')

export class MatchBatting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  matchId: number;

  @Column()
  inningsId: number;

  @Column()
  player_id: number; // 1,2,3...

  @Column()
  index: number; // 1,2,3...

  @Column({ type: 'int' })
  balls: number; // ["1","4","W","0","6","WD"]

  @Column()
  runs: number;

  @Column({ type: 'int', default: 0 })
  fours: number;

  @Column({ type: 'int', default: 0 })
  sixes: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.00 })
  strikeRate: number;

  @Column({ default: 1 })
  status: number;
}
