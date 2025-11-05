import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Decision } from '../entities/decision.entity';
import { BaseService } from '../../../common/services/base.service';
import { CreateDecisionDto, UpdateDecisionDto } from '../dto/decision.dto';
import { EventsGateway, EventType } from '../../../common/gateways/events.gateway';

@Injectable()
export class DecisionService extends BaseService<Decision> {
  protected entityName = 'decision';

  constructor(
    @InjectRepository(Decision)
    private decisionRepository: Repository<Decision>,
    private eventsGateway: EventsGateway,
  ) {
    super(decisionRepository, eventsGateway);
  }

  async createDecision(createDecisionDto: CreateDecisionDto, userId?: string): Promise<Decision> {
    const decision = this.decisionRepository.create({
      ...createDecisionDto,
      createdBy: userId,
    });

    const savedDecision = await this.decisionRepository.save(decision);
    this.notifyChange(EventType.ENTITY_CREATED, savedDecision.id, savedDecision, userId);
    return savedDecision;
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

    const savedDecision = await this.decisionRepository.save(decision);
    this.notifyChange(EventType.ENTITY_UPDATED, savedDecision.id, savedDecision, userId);
    return savedDecision;
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
