import { IsString, IsOptional } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateGroupDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
