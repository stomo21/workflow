import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Approval } from './approval.entity';

export enum PatternType {
  SEQUENTIAL = 'sequential',
  PARALLEL = 'parallel',
  CONDITIONAL = 'conditional',
  ESCALATION = 'escalation',
}

export enum PatternStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

@Entity('patterns')
export class Pattern extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: PatternType,
    default: PatternType.SEQUENTIAL,
  })
  type: PatternType;

  @Column({
    type: 'enum',
    enum: PatternStatus,
    default: PatternStatus.DRAFT,
  })
  status: PatternStatus;

  @Column({ type: 'jsonb', nullable: true })
  configuration?: {
    steps?: any[];
    conditions?: any[];
    escalationRules?: any[];
    timeouts?: any;
  };

  @Column({ type: 'int', default: 1 })
  version: number;

  @OneToMany(() => Approval, (approval) => approval.pattern)
  approvals: Approval[];
}
