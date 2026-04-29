import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    HttpCode,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { MatchSettingService } from './match-setting.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/auth/jwt.guard';
import { IsNotEmpty, IsString, IsInt, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { EnumTypes } from '../Entity/type.entity';

export class CreateTypeDto {
  @IsNotEmpty()
  @IsEnum(EnumTypes)
  compitition: EnumTypes;

  @IsNotEmpty()
  @IsString()
  name: string;
}

export class CreatePoolDto {
  @IsNotEmpty()
  @IsInt()
  type_id: number;

  @IsNotEmpty()
  @IsString()
  pool_name: string;

  @IsNotEmpty()
  @IsInt()
  team_id: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

@UseGuards(JwtGuard)
@Controller('match-setting')
export class MatchSettingController {
    constructor(private readonly service: MatchSettingService) { }

    // ================= TYPE =================

    @Post('type')
    @HttpCode(HttpStatus.CREATED)
    async createType(@Body() body: CreateTypeDto) {
        return await this.service.createType(body);
    }

    @Put('type/:id')
    async updateType(
        @Param('id') id: number,
        @Body() body: Partial<CreateTypeDto>,
    ) {
        return await this.service.updateType(+id, body);
    }

    // ================= POOL =================

    @Post('pool/create')
    @HttpCode(HttpStatus.CREATED)
    async createPool(@Body() body: CreatePoolDto) {
        return await this.service.createPool(body);
    }

    @Put('pool/update')
    async updatePool(@Body() body: Partial<CreatePoolDto>) {
        return await this.service.updatePool(body);
    }

    @Get('pool/list')
    async getAllPools() {
        return await this.service.getAllPools();
    }

    // ================= DETAILS =================

    @Get('details')
    async getDetails() {
        return await this.service.getDetails();
    }
}
