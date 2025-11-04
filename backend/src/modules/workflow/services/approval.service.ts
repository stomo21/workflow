import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Approval } from '../entities/approval.entity';
import { BaseService } from '../../../common/services/base.service';
import { CreateApprovalDto, UpdateApprovalDto } from '../dto/approval.dto';

@Injectable()
export class ApprovalService extends BaseService<Approval> {
  constructor(
    @InjectRepository(Approval)
    private approvalRepository: Repository<Approval>,
  ) {
    super(approvalRepository);
  }

  async createApproval(createApprovalDto: CreateApprovalDto, userId?: string): Promise<Approval> {
    const approval = this.approvalRepository.create({
      ...createApprovalDto,
      createdBy: userId,
    });

    return this.approvalRepository.save(approval);
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

    return this.approvalRepository.save(approval);
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
