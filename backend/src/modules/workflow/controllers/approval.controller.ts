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
import { ApprovalService } from '../services/approval.service';
import { CreateApprovalDto, UpdateApprovalDto } from '../dto/approval.dto';
import { ClerkAuthGuard } from '../../../common/guards/clerk-auth.guard';
import { CurrentUser } from '../../../common/decorators/user.decorator';
import { EventsGateway, EventType } from '../../../common/gateways/events.gateway';
import { BaseController } from '../../../common/controllers/base.controller';
import { Approval } from '../entities/approval.entity';
import { QueryParams } from '../../../common/services/base.service';

@Controller('approvals')
@UseGuards(ClerkAuthGuard)
export class ApprovalController extends BaseController<Approval> {
  constructor(
    private readonly approvalService: ApprovalService,
    private readonly eventsGateway: EventsGateway,
  ) {
    super(approvalService, 'Approval');
  }

  protected getRelations(): string[] {
    return ['pattern', 'assignedTo', 'decisions', 'exceptions'];
  }

  protected getFilterFields(): string[] {
    return ['status', 'priority', 'isActive'];
  }

  @Get('my-approvals')
  async findMyApprovals(@Query() query: QueryParams, @CurrentUser() user: any) {
    return this.approvalService.findByAssignee(user.sub, query);
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string, @Query() query: QueryParams) {
    return this.approvalService.findByStatus(status, query);
  }

  @Post()
  async create(@Body() createApprovalDto: CreateApprovalDto, @CurrentUser() user: any) {
    return this.approvalService.createApproval(createApprovalDto, user?.sub);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateApprovalDto: UpdateApprovalDto,
    @CurrentUser() user: any,
  ) {
    const approval = await this.approvalService.updateApproval(id, updateApprovalDto, user?.sub);

    // Domain-specific event for status changes
    if (updateApprovalDto.status) {
      this.eventsGateway.notifyEntityChange(
        EventType.APPROVAL_STATUS_CHANGED,
        'approval',
        approval.id,
        { status: approval.status },
        user?.sub,
      );
    }

    return approval;
  }
}
