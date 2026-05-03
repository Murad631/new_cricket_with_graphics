import {
  Entity, PrimaryGeneratedColumn, Column, Index, Unique,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { TeamStatus } from './enums';

@Entity('teams')
@Unique('UQ_team_shortName', ['shortName'])
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 120 })
  @Index()
  name: string;

  @Column({ type: 'varchar', length: 20 })
  @Index()
  shortName: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logo?: string; // file path/url

  @Column({ type: 'simple-array' })
  primaryColor: string[]; // ['#RRGGBB'] or ['#RRGGBB', '#RRGGBB']

  @Column({ type: 'varchar', length: 7 })
  secondaryColor: string; // #RRGGBB

  @Column({ type: 'enum', enum: TeamStatus, default: TeamStatus.ACTIVE })
  status: TeamStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
