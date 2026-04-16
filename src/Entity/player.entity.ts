import {
  Entity, PrimaryGeneratedColumn, Column, Index, Unique,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { PlayerRole } from './enums';

@Entity('players')
@Index('IDX_players_teamId', ['teamId'])
@Unique('UQ_players_team_shirt', ['teamId', 'shirtNo'])
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  teamId: number; // teams.id

  @Column({ name: 'first_name', type: 'varchar', length: 80 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 80 })
  lastName: string;

  @Column({ type: 'enum', enum: PlayerRole })
  role: PlayerRole;

  @Column({ type: 'int' })
  shirtNo: number;

  // Better than storing age (age changes). Compute age from DOB in API.
  @Column({ type: 'date', nullable: true })
  dateOfBirth?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  battingStyle?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bowlingStyle?: string;

  @Column({ name: 'no_of_matches', type: 'int', default: 0 })
  noOfMatches: number;

  // strike rate is decimal (e.g. 142.85)
  @Column({ name: 'strike_rate', type: 'decimal', precision: 6, scale: 2, default: 0 })
  strikeRate: string; // decimal returns string in TypeORM

  @Column({ type: 'varchar', length: 500, nullable: true })
  image?: string;

  @Column({ type: 'tinyint', default: 1 })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
