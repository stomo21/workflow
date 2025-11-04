import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { AuditLogService } from './services/audit-log.service';
import { AuditLogController } from './controllers/audit-log.controller';
import { EventsGateway } from './gateways/events.gateway';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditLogService, EventsGateway],
  controllers: [AuditLogController],
  exports: [AuditLogService, EventsGateway],
})
export class CommonModule {}
