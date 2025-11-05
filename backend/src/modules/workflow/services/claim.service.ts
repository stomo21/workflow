import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from '../entities/claim.entity';
import { BaseService } from '../../../common/services/base.service';
import { CreateClaimDto, UpdateClaimDto } from '../dto/claim.dto';
import { EventsGateway, EventType } from '../../../common/gateways/events.gateway';

@Injectable()
export class ClaimService extends BaseService<Claim> {
  protected entityName = 'claim';

  constructor(
    @InjectRepository(Claim)
    private claimRepository: Repository<Claim>,
    private eventsGateway: EventsGateway,
  ) {
    super(claimRepository, eventsGateway);
  }

  async createClaim(createClaimDto: CreateClaimDto, userId?: string): Promise<Claim> {
    const claim = this.claimRepository.create({
      ...createClaimDto,
      createdBy: userId,
    });

    const savedClaim = await this.claimRepository.save(claim);
    this.notifyChange(EventType.ENTITY_CREATED, savedClaim.id, savedClaim, userId);
    return savedClaim;
  }

  async updateClaim(
    id: string,
    updateClaimDto: UpdateClaimDto,
    userId?: string,
  ): Promise<Claim> {
    const claim = await this.findOne(id);
    if (!claim) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }

    Object.assign(claim, updateClaimDto);
    claim.updatedBy = userId;

    const savedClaim = await this.claimRepository.save(claim);
    this.notifyChange(EventType.ENTITY_UPDATED, savedClaim.id, savedClaim, userId);
    return savedClaim;
  }

  async claimWorkItem(id: string, userId: string): Promise<Claim> {
    const claim = await this.findOne(id);
    if (!claim) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }

    claim.claimedById = userId;
    claim.claimedAt = new Date();
    claim.status = 'in_progress' as any;
    claim.updatedBy = userId;

    const savedClaim = await this.claimRepository.save(claim);
    this.notifyChange(EventType.ENTITY_UPDATED, savedClaim.id, savedClaim, userId);
    return savedClaim;
  }

  async completeClaim(id: string, userId?: string): Promise<Claim> {
    const claim = await this.findOne(id);
    if (!claim) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }

    claim.status = 'completed' as any;
    claim.completedAt = new Date();
    claim.updatedBy = userId;

    const savedClaim = await this.claimRepository.save(claim);
    this.notifyChange(EventType.ENTITY_UPDATED, savedClaim.id, savedClaim, userId);
    return savedClaim;
  }

  async findByUser(userId: string, queryParams: any) {
    return this.findAll({
      ...queryParams,
      filters: { claimedById: userId },
    });
  }

  async findByStatus(status: string, queryParams: any) {
    return this.findAll({
      ...queryParams,
      filters: { status },
    });
  }

  async findAvailable(queryParams: any) {
    return this.findAll({
      ...queryParams,
      filters: { status: 'open', claimedById: null },
    });
  }
}
