import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuditLogService } from '../services/audit-log.service';
import { ClerkAuthGuard } from '../guards/clerk-auth.guard';
import { QueryParams } from '../services/base.service';

@Controller('audit-logs')
@UseGuards(ClerkAuthGuard)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  async findAll(@Query() query: QueryParams) {
    return this.auditLogService.findAll(query);
  }

  @Get('entity/:entityType/:entityId')
  async findByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.auditLogService.findByEntity(entityType, entityId);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string, @Query() query: any) {
    return this.auditLogService.findByUser(userId, query);
  }

  @Get('timeline/:entityType/:entityId')
  async getEntityTimeline(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.auditLogService.getEntityTimeline(entityType, entityId);
  }
}
