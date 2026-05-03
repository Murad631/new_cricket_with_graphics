import { IsIn, IsOptional, IsString, Length, IsEnum, IsArray } from 'class-validator';
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

  @IsArray()
  @IsString({ each: true })
  primaryColor: string[]; // ['#RRGGBB'] or ['#RRGGBB', '#RRGGBB']

  @IsString()
  @Length(4, 7)
  secondaryColor: string;

  @IsOptional()
  @IsEnum(TeamStatus)
  status?: TeamStatus; // default handled by entity
}
