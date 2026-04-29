import { IsIn, IsOptional, IsString, Length, IsEnum } from 'class-validator';
import { TeamStatus } from '../Entity/enums';

export class CreateTeamDto {
  @IsString()
  @Length(2, 120)
  name: string;

  @IsString()
  @Length(2, 20)
  shortName: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsString()
  @Length(4, 7)
  primaryColor: string; // #RRGGBB

  @IsString()
  @Length(4, 7)
  secondaryColor: string;

  @IsOptional()
  @IsEnum(TeamStatus)
  status?: TeamStatus; // default handled by entity
}
