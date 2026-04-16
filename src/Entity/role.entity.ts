// src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role_name: string;

  @CreateDateColumn()
 created_at: Date;

 @UpdateDateColumn()
   updated_at: Date;
}