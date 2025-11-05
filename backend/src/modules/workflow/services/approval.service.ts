import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Approval } from '../entities/approval.entity';
import { BaseService } from '../../../common/services/base.service';
import { CreateApprovalDto, UpdateApprovalDto } from '../dto/approval.dto';
import { EventsGateway, EventType } from '../../../common/gateways/events.gateway';

@Injectable()
export class ApprovalService extends BaseService<Approval> {
  protected entityName = 'approval';

  constructor(
    @InjectRepository(Approval)
    private approvalRepository: Repository<Approval>,
    private eventsGateway: EventsGateway,
  ) {
    super(approvalRepository, eventsGateway);
  }

  async createApproval(createApprovalDto: CreateApprovalDto, userId?: string): Promise<Approval> {
    const approval = this.approvalRepository.create({
      ...createApprovalDto,
      createdBy: userId,
    });

    const savedApproval = await this.approvalRepository.save(approval);
    this.notifyChange(EventType.ENTITY_CREATED, savedApproval.id, savedApproval, userId);
    return savedApproval;
  }

  async updateApproval(
    id: string,
    updateApprovalDto: UpdateApprovalDto,
    userId?: string,
  ): Promise<Approval> {
    const approval = await this.findOne(id);
    if (!approval) {
      throw new NotFoundException(`Approval with ID ${id} not found`);
    }

    Object.assign(approval, updateApprovalDto);
    approval.updatedBy = userId;

    const savedApproval = await this.approvalRepository.save(approval);
    this.notifyChange(EventType.ENTITY_UPDATED, savedApproval.id, savedApproval, userId);
    return savedApproval;
  }

  async findByAssignee(userId: string, queryParams: any) {
    return this.findAll({
      ...queryParams,
      filters: { assignedToId: userId },
    });
  }

  async findByStatus(status: string, queryParams: any) {
    return this.findAll({
      ...queryParams,
      filters: { status },
    });
  }
}
