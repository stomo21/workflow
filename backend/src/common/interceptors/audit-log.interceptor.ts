import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AuditLogService } from '../services/audit-log.service';
import { AUDIT_LOG_KEY, AuditLogMetadata } from '../decorators/audit-log.decorator';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditLogService: AuditLogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const metadata = this.reflector.get<AuditLogMetadata>(
      AUDIT_LOG_KEY,
      context.getHandler(),
    );

    if (!metadata) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const { action, entityType, description } = metadata;

    return next.handle().pipe(
      tap(async (data) => {
        try {
          const userId = request.user?.sub || request.user?.id;
          const userName = request.user?.email || request.user?.name;
          const entityId = data?.id || request.params?.id;

          await this.auditLogService.createLog({
            entityType,
            entityId,
            action,
            userId,
            userName,
            description,
            newValues: data,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
          });
        } catch (error) {
          console.error('Failed to create audit log:', error);
        }
      }),
    );
  }
}
