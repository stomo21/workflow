import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Approval } from './approval.entity';

export enum ExceptionType {
  TIMEOUT = 'timeout',
  VALIDATION_ERROR = 'validation_error',
  BUSINESS_RULE_VIOLATION = 'business_rule_violation',
  SYSTEM_ERROR = 'system_error',
  USER_ESCALATION = 'user_escalation',
  OTHER = 'other',
}

export enum ExceptionStatus {
  OPEN = 'open',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity('exceptions')
export class Exception extends BaseEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ExceptionType,
  })
  type: ExceptionType;

  @Column({
    type: 'enum',
    enum: ExceptionStatus,
    default: ExceptionStatus.OPEN,
  })
  status: ExceptionStatus;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ type: 'text', nullable: true })
  stackTrace?: string;

  @Column({ type: 'jsonb', nullable: true })
  context?: Record<string, any>;

  @ManyToOne(() => Approval, (approval) => approval.exceptions, { nullable: true })
  @JoinColumn({ name: 'approvalId' })
  approval?: Approval;

  @Column({ type: 'uuid', nullable: true })
  approvalId?: string;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt?: Date;

  @Column({ type: 'varchar', nullable: true })
  resolvedBy?: string;

  @Column({ type: 'text', nullable: true })
  resolution?: string;
}
