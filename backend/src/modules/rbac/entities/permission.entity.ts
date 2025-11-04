import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Role } from './role.entity';

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}

export enum PermissionResource {
  USER = 'user',
  GROUP = 'group',
  ROLE = 'role',
  PERMISSION = 'permission',
  PATTERN = 'pattern',
  APPROVAL = 'approval',
  EXCEPTION = 'exception',
  CLAIM = 'claim',
  DECISION = 'decision',
  ALL = 'all',
}

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: PermissionAction,
  })
  action: PermissionAction;

  @Column({
    type: 'enum',
    enum: PermissionResource,
  })
  resource: PermissionResource;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
