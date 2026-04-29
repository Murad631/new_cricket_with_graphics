// src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role_id: number;

  @Column()
  role_name: string; // ✅ ADD THIS

  @Column({ nullable: true })
  currentJwtSecret: string;
}