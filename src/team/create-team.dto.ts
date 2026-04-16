import { IsIn, IsOptional, IsString, Length } from 'class-validator';

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
  @IsIn(['active', 'inactive'])
  status?: string; // default handled by entity
}
