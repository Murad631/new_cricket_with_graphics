import { Entity, PrimaryGeneratedColumn, Column, Index, Unique, UpdateDateColumn } from 'typeorm';

@Entity('scoreboard_state')
// @Unique('UQ_scoreboard_state_match', ['matchId'])
export class ScoreboardState {
  map(arg0: (st: any) => Promise<void>): any {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  @Index()
  matchId: number;

  @Column({ type: 'int', nullable: true })
  currentInningsId?: number ;

  // MatchSquad.id
  @Column({ type: 'int', nullable: true })
  strikerSquadId?: number;

  @Column({ type: 'int', nullable: true })
  nonStrikerSquadId?: number;

  @Column({ type: 'int', nullable: true })
  bowlerSquadId?: number;

  @Column({ type: 'int', default: 0 })
  total_run: number;

  @Column({ type: 'int', default: 0 })
  currentOverNumber: number;

  @Column({ type: 'int', default: 0  })
  total_wickets: number;

  @Column({ type: 'int', default: 0  })
  total_extra: number;

  @UpdateDateColumn()
  updatedAt: Date;

}
