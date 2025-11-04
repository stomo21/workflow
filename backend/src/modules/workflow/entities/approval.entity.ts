import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../rbac/entities/user.entity';
import { Pattern } from './pattern.entity';
import { Decision } from './decision.entity';
import { Exception } from './exception.entity';

export enum ApprovalStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ESCALATED = 'escalated',
  CANCELLED = 'cancelled',
}

export enum ApprovalPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('approvals')
export class Approval extends BaseEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.PENDING,
  })
  status: ApprovalStatus;

  @Column({
    type: 'enum',
    enum: ApprovalPriority,
    default: ApprovalPriority.MEDIUM,
  })
  priority: ApprovalPriority;

  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @Column({ type: 'jsonb', nullable: true })
  payload?: Record<string, any>;

  @ManyToOne(() => Pattern, (pattern) => pattern.approvals, { nullable: true })
  @JoinColumn({ name: 'patternId' })
  pattern?: Pattern;

  @Column({ type: 'uuid', nullable: true })
  patternId?: string;

  @ManyToOne(() => User, (user) => user.approvals, { nullable: true })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo?: User;

  @Column({ type: 'uuid', nullable: true })
  assignedToId?: string;

  @OneToMany(() => Decision, (decision) => decision.approval)
  decisions: Decision[];

  @OneToMany(() => Exception, (exception) => exception.approval)
  exceptions: Exception[];

  @Column({ type: 'int', default: 0 })
  currentStep: number;
}
