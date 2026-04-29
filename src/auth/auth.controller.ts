// src/auth/auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsNotEmpty, IsString } from 'class-validator';

class LoginDto {
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username cannot Empty' })
  username: string;


  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password cannot Empty' })
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }


  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }
}