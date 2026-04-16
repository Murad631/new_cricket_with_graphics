import { Entity, PrimaryGeneratedColumn, Column, Index, Unique } from 'typeorm';
import { InningsNumber } from './enums';

@Entity('innings')
@Unique('UQ_innings_match_number', ['matchId', 'number'])
@Index('IDX_innings_match', ['matchId'])
export class Innings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  matchId: number; // matches.id

  @Column({ type: 'enum', enum: InningsNumber })
  number: InningsNumber; // FIRST/SECOND

  @Column({ type: 'int' })
  battingTeamId: number; // teams.id

  @Column({ type: 'int' })
  bowlingTeamId: number; // teams.id

  @Column({ type: 'int', nullable: true })
  targetRuns?: number;

  @Column({ type: 'int', nullable: true })
  total_extra?: number;

  @Column({ 
    type: 'decimal',
    precision: 5,   
    scale: 2,      
    nullable: true 
  })
  total_attempt_over?: number;

  @Column({ type: 'datetime', nullable: true })
  startedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  endedAt?: Date;

  @Column({ type: 'tinyint', default:0})
  isActive: boolean;
}
