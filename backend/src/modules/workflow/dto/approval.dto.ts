import { IsString, IsOptional, IsEnum, IsUUID, IsDateString, IsObject } from 'class-validator';
import { ApprovalStatus, ApprovalPriority } from '../entities/approval.entity';

export class CreateApprovalDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ApprovalPriority)
  @IsOptional()
  priority?: ApprovalPriority;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsObject()
  @IsOptional()
  payload?: Record<string, any>;

  @IsUUID()
  @IsOptional()
  patternId?: string;

  @IsUUID()
  @IsOptional()
  assignedToId?: string;
}

export class UpdateApprovalDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ApprovalStatus)
  @IsOptional()
  status?: ApprovalStatus;

  @IsEnum(ApprovalPriority)
  @IsOptional()
  priority?: ApprovalPriority;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsObject()
  @IsOptional()
  payload?: Record<string, any>;

  @IsUUID()
  @IsOptional()
  assignedToId?: string;
}
