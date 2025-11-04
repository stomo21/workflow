import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from './user.entity';
import { Group } from './group.entity';
import { Permission } from './permission.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ManyToMany(() => Group, (group) => group.roles, { cascade: true })
  @JoinTable({
    name: 'group_roles',
    joinColumn: { name: 'roleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'groupId', referencedColumnName: 'id' },
  })
  groups: Group[];

  @ManyToMany(() => Permission, (permission) => permission.roles, { cascade: true })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'roleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permissionId', referencedColumnName: 'id' },
  })
  permissions: Permission[];
}
