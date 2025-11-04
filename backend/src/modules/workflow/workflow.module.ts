import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pattern } from './entities/pattern.entity';
import { Approval } from './entities/approval.entity';
import { Exception } from './entities/exception.entity';
import { Claim } from './entities/claim.entity';
import { Decision } from './entities/decision.entity';
import { ApprovalService } from './services/approval.service';
import { PatternService } from './services/pattern.service';
import { ExceptionService } from './services/exception.service';
import { ClaimService } from './services/claim.service';
import { DecisionService } from './services/decision.service';
import { ApprovalController } from './controllers/approval.controller';
import { PatternController } from './controllers/pattern.controller';
import { ExceptionController } from './controllers/exception.controller';
import { ClaimController } from './controllers/claim.controller';
import { DecisionController } from './controllers/decision.controller';
import { EventsGateway } from '../../common/gateways/events.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Pattern, Approval, Exception, Claim, Decision])],
  providers: [
    ApprovalService,
    PatternService,
    ExceptionService,
    ClaimService,
    DecisionService,
    EventsGateway,
  ],
  controllers: [
    ApprovalController,
    PatternController,
    ExceptionController,
    ClaimController,
    DecisionController,
  ],
  exports: [
    ApprovalService,
    PatternService,
    ExceptionService,
    ClaimService,
    DecisionService,
  ],
})
export class WorkflowModule {}
