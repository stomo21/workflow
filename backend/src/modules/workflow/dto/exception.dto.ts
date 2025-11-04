import { IsString, IsOptional, IsEnum, IsObject, IsUUID } from 'class-validator';
import { ExceptionType, ExceptionStatus } from '../entities/exception.entity';

export class CreateExceptionDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ExceptionType)
  type: ExceptionType;

  @IsString()
  @IsOptional()
  errorMessage?: string;

  @IsString()
  @IsOptional()
  stackTrace?: string;

  @IsObject()
  @IsOptional()
  context?: Record<string, any>;

  @IsUUID()
  @IsOptional()
  approvalId?: string;
}

export class UpdateExceptionDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ExceptionStatus)
  @IsOptional()
  status?: ExceptionStatus;

  @IsString()
  @IsOptional()
  resolution?: string;
}
