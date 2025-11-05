import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DecisionService } from '../services/decision.service';
import { CreateDecisionDto, UpdateDecisionDto } from '../dto/decision.dto';
import { ClerkAuthGuard } from '../../../common/guards/clerk-auth.guard';
import { CurrentUser } from '../../../common/decorators/user.decorator';
import { EventsGateway, EventType } from '../../../common/gateways/events.gateway';
import { BaseController } from '../../../common/controllers/base.controller';
import { Decision } from '../entities/decision.entity';
import { QueryParams } from '../../../common/services/base.service';

@Controller('decisions')
@UseGuards(ClerkAuthGuard)
export class DecisionController extends BaseController<Decision> {
  constructor(
    private readonly decisionService: DecisionService,
    private readonly eventsGateway: EventsGateway,
  ) {
    super(decisionService, 'Decision');
  }

  protected getRelations(): string[] {
    return ['approval', 'decidedBy'];
  }

  @Get('approval/:approvalId')
  async findByApproval(@Param('approvalId') approvalId: string, @Query() query: QueryParams) {
    return this.decisionService.findByApproval(approvalId, query);
  }

  @Get('my-decisions')
  async findMyDecisions(@Query() query: QueryParams, @CurrentUser() user: any) {
    return this.decisionService.findByUser(user.sub, query);
  }

  @Get('type/:type')
  async findByType(@Param('type') type: string, @Query() query: QueryParams) {
    return this.decisionService.findByType(type, query);
  }

  @Post()
  async create(@Body() createDecisionDto: CreateDecisionDto, @CurrentUser() user: any) {
    const decision = await this.decisionService.createDecision(createDecisionDto, user?.sub);

    // Domain-specific event for decision made
    this.eventsGateway.notifyEntityChange(
      EventType.DECISION_MADE,
      'decision',
      decision.id,
      decision,
      user?.sub,
    );

    return decision;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDecisionDto: UpdateDecisionDto,
    @CurrentUser() user: any,
  ) {
    return this.decisionService.updateDecision(id, updateDecisionDto, user?.sub);
  }
}
