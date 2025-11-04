import { IsString, IsOptional, IsEnum, IsObject, IsUUID } from 'class-validator';
import { DecisionType } from '../entities/decision.entity';

export class CreateDecisionDto {
  @IsUUID()
  approvalId: string;

  @IsUUID()
  decidedById: string;

  @IsEnum(DecisionType)
  type: DecisionType;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsObject()
  @IsOptional()
  details?: Record<string, any>;
}

export class UpdateDecisionDto {
  @IsString()
  @IsOptional()
  comment?: string;

  @IsObject()
  @IsOptional()
  details?: Record<string, any>;
}
