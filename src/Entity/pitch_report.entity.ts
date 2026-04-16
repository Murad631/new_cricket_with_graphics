import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('pitch_reports')
export class PitchReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  matchId: number;

  @Column({ nullable: true })
  inningsId: number; // Innings awareness to allow "shifting" the pitch between innings

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  grassCover: number; // 0-10 scale

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  turnProjection: number; // 0-10 scale

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  paceBounce: number; // 0-10 scale

  @Column({ nullable: true })
  pitchType: string; // e.g. "Hard Surface"

  @Column({ nullable: true })
  boundaries: string; // e.g. "Large Square"

  @Column({ nullable: true })
  avgScore: string; // e.g. "175 Runs"

  @Column({ nullable: true })
  matchType: string; // e.g. "Night / Dew"

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
