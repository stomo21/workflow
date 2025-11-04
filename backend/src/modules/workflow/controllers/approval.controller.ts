import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
import { QueryParams } from '../../../common/services/base.service';

@Controller('approvals')
@UseGuards(ClerkAuthGuard)
export class ApprovalController {
  constructor(
    private readonly approvalService: ApprovalService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Get()
  async findAll(@Query() query: QueryParams) {
    return this.approvalService.findAll(query);
  }

  @Get('my-approvals')
  async findMyApprovals(@Query() query: QueryParams, @CurrentUser() user: any) {
    return this.approvalService.findByAssignee(user.sub, query);
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string, @Query() query: QueryParams) {
    return this.approvalService.findByStatus(status, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.approvalService.findOne(id, ['pattern', 'assignedTo', 'decisions', 'exceptions']);
  }

  @Post()
  async create(@Body() createApprovalDto: CreateApprovalDto, @CurrentUser() user: any) {
    const approval = await this.approvalService.createApproval(createApprovalDto, user?.sub);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_CREATED,
      'approval',
      approval.id,
      approval,
      user?.sub,
    );
    return approval;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateApprovalDto: UpdateApprovalDto,
    @CurrentUser() user: any,
  ) {
    const approval = await this.approvalService.updateApproval(id, updateApprovalDto, user?.sub);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_UPDATED,
      'approval',
      approval.id,
      approval,
      user?.sub,
    );

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

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.approvalService.remove(id);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_DELETED,
      'approval',
      id,
      { id },
      user?.sub,
    );
    return { message: 'Approval deleted successfully' };
  }
}
