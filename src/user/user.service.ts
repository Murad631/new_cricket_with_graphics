// src/users/users.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../Entity/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username });
  }


 async register(data: any) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const exist = await this.userRepository.findOne({
    where: { username: data.username },
  });

    if (exist) {
      throw new BadRequestException('Username is already registered');
    }

    const user = this.userRepository.create({
      username: data.username,
      password: hashedPassword,
      role_id: data.role_id || 2,
    });

    try {
      await this.userRepository.save(user);
      return true;
    } catch (error) {
      throw new BadRequestException('User registration failed');
    }
  }

  const user = this.userRepository.create({
    username: data.username,
    password: hashedPassword,
    role_id: data.role_id,
    role_name: data.role_name, 
  });

  try {
    await this.userRepository.save(user);
    return true;
  } catch (error) {
    console.log(error); // 🔥 real error dekhne ke liye
    throw new BadRequestException('User registration failed');
  }
}

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }
  async updateJwtSecret(userId: number, secret: string) {
    await this.userRepository.update(userId, { currentJwtSecret: secret });
  }

  // Optional: create user (for testing)
  async create(username: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ username, password: hashed });
    return this.userRepository.save(user);
  }
}