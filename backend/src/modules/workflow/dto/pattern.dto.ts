import { IsString, IsOptional, IsEnum, IsObject, IsInt } from 'class-validator';
import { PatternType, PatternStatus } from '../entities/pattern.entity';

export class CreatePatternDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PatternType)
  @IsOptional()
  type?: PatternType;

  @IsEnum(PatternStatus)
  @IsOptional()
  status?: PatternStatus;

  @IsObject()
  @IsOptional()
  configuration?: {
    steps?: any[];
    conditions?: any[];
    escalationRules?: any[];
    timeouts?: any;
  };

  @IsInt()
  @IsOptional()
  version?: number;
}

export class UpdatePatternDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PatternType)
  @IsOptional()
  type?: PatternType;

  @IsEnum(PatternStatus)
  @IsOptional()
  status?: PatternStatus;

  @IsObject()
  @IsOptional()
  configuration?: {
    steps?: any[];
    conditions?: any[];
    escalationRules?: any[];
    timeouts?: any;
  };

  @IsInt()
  @IsOptional()
  version?: number;
}
