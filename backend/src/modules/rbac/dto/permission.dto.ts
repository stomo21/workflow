import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PermissionAction, PermissionResource } from '../entities/permission.entity';

export class CreatePermissionDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PermissionAction)
  action: PermissionAction;

  @IsEnum(PermissionResource)
  resource: PermissionResource;
}

export class UpdatePermissionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PermissionAction)
  @IsOptional()
  action?: PermissionAction;

  @IsEnum(PermissionResource)
  @IsOptional()
  resource?: PermissionResource;
}
