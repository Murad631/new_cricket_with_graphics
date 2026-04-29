import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { UserService } from './user.service';
import { Res } from '@nestjs/common';

// class RegisterDto {
//     @IsString({ message: 'Username must be a string' })
//     @IsNotEmpty({ message: 'Username cannot Empty' })
//     username: string;


//     @IsString({ message: 'Password must be a string' })
//     @IsNotEmpty({ message: 'Password cannot Empty' })
//     password: string;



    @IsOptional()
    role_id?: any;

// }
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
