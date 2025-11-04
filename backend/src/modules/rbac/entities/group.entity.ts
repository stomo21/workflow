import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity('groups')
export class Group extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToMany(() => User, (user) => user.groups)
  users: User[];

  @ManyToMany(() => Role, (role) => role.groups)
  roles: Role[];
}
