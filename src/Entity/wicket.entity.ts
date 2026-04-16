import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';
import { WicketType, OutEnd } from './enums';

@Entity('wickets')
@Index('IDX_wickets_innings', ['inningsId'])
export class Wicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  inningsId: number; // innings.id

  @Column({ type: 'enum', enum: WicketType })
  type: WicketType; // bowled, caught, LBW, etc.

  @Column({ type: 'int' })
  outBatsmanSquadId: number; // MatchSquad.id (out batsman)

  @Column({ type: 'int', nullable: true })
  creditedBowlerSquadId?: number; // MatchSquad.id (bowler)

  @Column({ type: 'int', nullable: true })
  fielder1SquadId?: number; // MatchSquad.id (fielder)

  @Column({ type: 'tinyint', default: 1 })
  isBowlerWicket: boolean; // Whether the bowler got credit for the wicket

  @Column({ type: 'enum', enum: OutEnd, default: OutEnd.UNKNOWN })
  outEnd: OutEnd; // Type of out (run-out, caught, etc.)

  @Column({ type: 'int', nullable: true })
  causedByDeliverySeq?: number; // Which delivery caused the wicket (linked to Delivery.id)

  @Column({ type: 'int', nullable: true })
  teamScore?: number; // Team score when wicket fell

  @CreateDateColumn()
  createdAt: Date;
}
