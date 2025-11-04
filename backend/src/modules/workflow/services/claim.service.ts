import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from '../entities/claim.entity';
import { BaseService } from '../../../common/services/base.service';
import { CreateClaimDto, UpdateClaimDto } from '../dto/claim.dto';

@Injectable()
export class ClaimService extends BaseService<Claim> {
  constructor(
    @InjectRepository(Claim)
    private claimRepository: Repository<Claim>,
  ) {
    super(claimRepository);
  }

  async createClaim(createClaimDto: CreateClaimDto, userId?: string): Promise<Claim> {
    const claim = this.claimRepository.create({
      ...createClaimDto,
      createdBy: userId,
    });

    return this.claimRepository.save(claim);
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

    return this.claimRepository.save(claim);
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

    return this.claimRepository.save(claim);
  }

  async completeClaim(id: string, userId?: string): Promise<Claim> {
    const claim = await this.findOne(id);
    if (!claim) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }

    claim.status = 'completed' as any;
    claim.completedAt = new Date();
    claim.updatedBy = userId;

    return this.claimRepository.save(claim);
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
