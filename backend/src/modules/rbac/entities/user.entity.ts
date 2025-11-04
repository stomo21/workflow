import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Group } from './group.entity';
import { Role } from './role.entity';
import { Approval } from '../../workflow/entities/approval.entity';
import { Claim } from '../../workflow/entities/claim.entity';
import { Decision } from '../../workflow/entities/decision.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  clerkId: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  firstName?: string;

  @Column({ type: 'varchar', nullable: true })
  lastName?: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl?: string;

  @ManyToMany(() => Group, (group) => group.users, { cascade: true })
  @JoinTable({
    name: 'user_groups',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'groupId', referencedColumnName: 'id' },
  })
  groups: Group[];

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
  })
  roles: Role[];

  @OneToMany(() => Approval, (approval) => approval.assignedTo)
  approvals: Approval[];

  @OneToMany(() => Claim, (claim) => claim.claimedBy)
  claims: Claim[];

  @OneToMany(() => Decision, (decision) => decision.decidedBy)
  decisions: Decision[];

  get fullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }
}
