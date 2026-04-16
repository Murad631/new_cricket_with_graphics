import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { UserService } from './user.service';
import { Res } from '@nestjs/common';

class RegisterDto {
    @IsString({ message: 'Username must be a string' })
    @IsNotEmpty({ message: 'Username cannot Empty' })
    username: string;


    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password cannot Empty' })
    password: string;



    @IsInt({ message: 'Role ID must be a Integer' })
    @IsNotEmpty({ message: 'Role ID cannot Empty' })
    role_id: string;

}
@Controller('user')

export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }

    @Post('register-user')
    @HttpCode(HttpStatus.CREATED) // 201
    async register(@Body() request: RegisterDto) {
   const message = await this.userService.register(request);
        return {
            message: 'User registered successfully',
        };
    }
}
