import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sponsor_logs')
export class SponsorLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sponsorId: number;

  @Column()
  inningsId: number;

  @Column({ nullable: true })
  matchId: number;

  @CreateDateColumn()
  timestamp: Date;
}
