import { IsString, IsOptional, IsEnum, IsObject, IsUUID } from 'class-validator';
import { ClaimType, ClaimStatus } from '../entities/claim.entity';

export class CreateClaimDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ClaimType)
  @IsOptional()
  type?: ClaimType;

  @IsObject()
  @IsOptional()
  payload?: Record<string, any>;

  @IsString()
  @IsOptional()
  referenceType?: string;

  @IsString()
  @IsOptional()
  referenceId?: string;
}

export class UpdateClaimDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ClaimStatus)
  @IsOptional()
  status?: ClaimStatus;

  @IsUUID()
  @IsOptional()
  claimedById?: string;
}

export class ClaimWorkItemDto {
  @IsUUID()
  claimedById: string;
}
