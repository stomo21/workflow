import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  BaseEntity as TypeOrmBaseEntity,
} from 'typeorm';

/**
 * Base entity class that all entities should extend.
 * Provides common fields: id, createdAt, updatedAt, deletedAt, createdBy, updatedBy
 */
export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @Column({ type: 'varchar', nullable: true })
  createdBy?: string;

  @Column({ type: 'varchar', nullable: true })
  updatedBy?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;
}
