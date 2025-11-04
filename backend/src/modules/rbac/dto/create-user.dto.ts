import { IsString, IsEmail, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsString()
  clerkId: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  groupIds?: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  roleIds?: string[];
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  groupIds?: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  roleIds?: string[];
}
