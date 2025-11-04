import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../rbac/entities/user.entity';
import { Approval } from './approval.entity';

export enum DecisionType {
  APPROVE = 'approve',
  REJECT = 'reject',
  DELEGATE = 'delegate',
  REQUEST_INFO = 'request_info',
  ESCALATE = 'escalate',
}

@Entity('decisions')
export class Decision extends BaseEntity {
  @ManyToOne(() => Approval, (approval) => approval.decisions)
  @JoinColumn({ name: 'approvalId' })
  approval: Approval;

  @Column({ type: 'uuid' })
  approvalId: string;

  @ManyToOne(() => User, (user) => user.decisions)
  @JoinColumn({ name: 'decidedById' })
  decidedBy: User;

  @Column({ type: 'uuid' })
  decidedById: string;

  @Column({
    type: 'enum',
    enum: DecisionType,
  })
  type: DecisionType;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ type: 'jsonb', nullable: true })
  details?: Record<string, any>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  decidedAt: Date;
}
