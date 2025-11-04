import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  RESTORE = 'restore',
  LOGIN = 'login',
  LOGOUT = 'logout',
  ASSIGN = 'assign',
  UNASSIGN = 'unassign',
  APPROVE = 'approve',
  REJECT = 'reject',
  CLAIM = 'claim',
  COMPLETE = 'complete',
  RESOLVE = 'resolve',
}

@Entity('audit_logs')
export class AuditLog extends BaseEntity {
  @Column({ type: 'varchar' })
  entityType: string;

  @Column({ type: 'varchar', nullable: true })
  entityId?: string;

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({ type: 'varchar', nullable: true })
  userId?: string;

  @Column({ type: 'varchar', nullable: true })
  userName?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  oldValues?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  newValues?: Record<string, any>;

  @Column({ type: 'varchar', nullable: true })
  ipAddress?: string;

  @Column({ type: 'varchar', nullable: true })
  userAgent?: string;
}
