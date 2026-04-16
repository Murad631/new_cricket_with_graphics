// src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string; // hashed

  @Column()
  role_id: number; // hashed

  @Column({ nullable: true })
  currentJwtSecret: string; // stores the latest secret used for JWT
}