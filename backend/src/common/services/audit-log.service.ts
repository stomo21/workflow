import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, AuditAction } from '../entities/audit-log.entity';
import { BaseService } from './base.service';

export interface CreateAuditLogDto {
  entityType: string;
  entityId?: string;
  action: AuditAction;
  userId?: string;
  userName?: string;
  description?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditLogService extends BaseService<AuditLog> {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {
    super(auditLogRepository);
  }

  async createLog(data: CreateAuditLogDto): Promise<AuditLog> {
    const log = this.auditLogRepository.create(data);
    return this.auditLogRepository.save(log);
  }

  async findByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { entityType, entityId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string, queryParams: any = {}): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: queryParams.limit || 50,
    });
  }

  async findByAction(action: AuditAction, queryParams: any = {}): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { action },
      order: { createdAt: 'DESC' },
      take: queryParams.limit || 50,
    });
  }

  async getEntityTimeline(entityType: string, entityId: string): Promise<AuditLog[]> {
    return this.findByEntity(entityType, entityId);
  }
}
