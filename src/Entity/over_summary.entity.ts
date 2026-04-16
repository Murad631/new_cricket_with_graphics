// src/entity/over-summary.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('over_summary')
@Index(['matchId', 'inningsId', 'overNumber'], { unique: true })
export class OverSummary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  matchId: number;

  @Column()
  inningsId: number;


  @Column()
  player_id: number; // 1,2,3...

  @Column()
  overNumber: number; // 1,2,3...

  @Column({ type: 'simple-json' })
  balls: string[]; // ["1","4","W","0","6","WD"]
  
  @Column({ type: 'int' })
  ball_index: number; // ["1","4","W","0","6","WD"]


  @Column({ default: 0 })
  runs: number;

  @Column({ default: 0 })
  wickets: number;

  @Column({ default: false })
  isMaiden: boolean;

  @Column({ default: 0 })
  extra: number;

  @Column({ type: 'int', nullable: true })
  bowlerSquadId?: number;

    @Column({ default: 1 })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
