import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sponsors')
export class Sponsor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  header: string; // e.g. "Broadcast Partner"

  @Column({ nullable: true })
  image: string; // Logo URL

  @Column({ nullable: true })
  tagline: string; // e.g. "Official Partner 2026"

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  charges: number;

  @Column({ default: 0 })
  show_count: number; // Max allowed shows

  @Column({ default: 0 })
  no_shown: number; // Current count

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get remain_shown(): number {
    return Math.max(0, this.show_count - this.no_shown);
  }
}
