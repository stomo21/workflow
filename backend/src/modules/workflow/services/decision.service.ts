import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Decision } from '../entities/decision.entity';
import { BaseService } from '../../../common/services/base.service';
import { CreateDecisionDto, UpdateDecisionDto } from '../dto/decision.dto';

@Injectable()
export class DecisionService extends BaseService<Decision> {
  constructor(
    @InjectRepository(Decision)
    private decisionRepository: Repository<Decision>,
  ) {
    super(decisionRepository);
  }

  async createDecision(createDecisionDto: CreateDecisionDto, userId?: string): Promise<Decision> {
    const decision = this.decisionRepository.create({
      ...createDecisionDto,
      createdBy: userId,
    });

    return this.decisionRepository.save(decision);
  }

  async updateDecision(
    id: string,
    updateDecisionDto: UpdateDecisionDto,
    userId?: string,
  ): Promise<Decision> {
    const decision = await this.findOne(id);
    if (!decision) {
      throw new NotFoundException(`Decision with ID ${id} not found`);
    }

    Object.assign(decision, updateDecisionDto);
    decision.updatedBy = userId;

    return this.decisionRepository.save(decision);
  }

  async findByApproval(approvalId: string, queryParams: any) {
    return this.findAll({
      ...queryParams,
      filters: { approvalId },
    });
  }

  async findByUser(userId: string, queryParams: any) {
    return this.findAll({
      ...queryParams,
      filters: { decidedById: userId },
    });
  }

  async findByType(type: string, queryParams: any) {
    return this.findAll({
      ...queryParams,
      filters: { type },
    });
  }
}
