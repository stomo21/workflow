import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../rbac/entities/user.entity';

export enum ClaimStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ClaimType {
  APPROVAL_CLAIM = 'approval_claim',
  WORK_ITEM = 'work_item',
  TASK = 'task',
  REVIEW = 'review',
}

@Entity('claims')
export class Claim extends BaseEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ClaimType,
    default: ClaimType.WORK_ITEM,
  })
  type: ClaimType;

  @Column({
    type: 'enum',
    enum: ClaimStatus,
    default: ClaimStatus.OPEN,
  })
  status: ClaimStatus;

  @ManyToOne(() => User, (user) => user.claims, { nullable: true })
  @JoinColumn({ name: 'claimedById' })
  claimedBy?: User;

  @Column({ type: 'uuid', nullable: true })
  claimedById?: string;

  @Column({ type: 'timestamp', nullable: true })
  claimedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ type: 'jsonb', nullable: true })
  payload?: Record<string, any>;

  @Column({ type: 'varchar', nullable: true })
  referenceType?: string;

  @Column({ type: 'varchar', nullable: true })
  referenceId?: string;
}
