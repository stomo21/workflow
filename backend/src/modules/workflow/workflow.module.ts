import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pattern } from './entities/pattern.entity';
import { Approval } from './entities/approval.entity';
import { Exception } from './entities/exception.entity';
import { Claim } from './entities/claim.entity';
import { Decision } from './entities/decision.entity';
import { ApprovalService } from './services/approval.service';
import { ApprovalController } from './controllers/approval.controller';
import { EventsGateway } from '../../common/gateways/events.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Pattern, Approval, Exception, Claim, Decision])],
  providers: [ApprovalService, EventsGateway],
  controllers: [ApprovalController],
  exports: [ApprovalService],
})
export class WorkflowModule {}
