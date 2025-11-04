import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pattern } from '../entities/pattern.entity';
import { BaseService } from '../../../common/services/base.service';
import { CreatePatternDto, UpdatePatternDto } from '../dto/pattern.dto';

@Injectable()
export class PatternService extends BaseService<Pattern> {
  constructor(
    @InjectRepository(Pattern)
    private patternRepository: Repository<Pattern>,
  ) {
    super(patternRepository);
  }

  async createPattern(createPatternDto: CreatePatternDto, userId?: string): Promise<Pattern> {
    const pattern = this.patternRepository.create({
      ...createPatternDto,
      createdBy: userId,
    });

    return this.patternRepository.save(pattern);
  }

  async updatePattern(
    id: string,
    updatePatternDto: UpdatePatternDto,
    userId?: string,
  ): Promise<Pattern> {
    const pattern = await this.findOne(id);
    if (!pattern) {
      throw new NotFoundException(`Pattern with ID ${id} not found`);
    }

    Object.assign(pattern, updatePatternDto);
    pattern.updatedBy = userId;

    return this.patternRepository.save(pattern);
  }

  async findByType(type: string, queryParams: any) {
    return this.findAll({
      ...queryParams,
      filters: { type },
    });
  }

  async findByStatus(status: string, queryParams: any) {
    return this.findAll({
      ...queryParams,
      filters: { status },
    });
  }

  async activatePattern(id: string, userId?: string): Promise<Pattern> {
    return this.updatePattern(id, { status: 'active' as any }, userId);
  }

  async deactivatePattern(id: string, userId?: string): Promise<Pattern> {
    return this.updatePattern(id, { status: 'inactive' as any }, userId);
  }
}
