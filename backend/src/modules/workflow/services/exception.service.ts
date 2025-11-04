import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exception } from '../entities/exception.entity';
import { BaseService } from '../../../common/services/base.service';
import { CreateExceptionDto, UpdateExceptionDto } from '../dto/exception.dto';

@Injectable()
export class ExceptionService extends BaseService<Exception> {
  constructor(
    @InjectRepository(Exception)
    private exceptionRepository: Repository<Exception>,
  ) {
    super(exceptionRepository);
  }

  async createException(createExceptionDto: CreateExceptionDto, userId?: string): Promise<Exception> {
    const exception = this.exceptionRepository.create({
      ...createExceptionDto,
      createdBy: userId,
    });

    return this.exceptionRepository.save(exception);
  }

  async updateException(
    id: string,
    updateExceptionDto: UpdateExceptionDto,
    userId?: string,
  ): Promise<Exception> {
    const exception = await this.findOne(id);
    if (!exception) {
      throw new NotFoundException(`Exception with ID ${id} not found`);
    }

    Object.assign(exception, updateExceptionDto);
    exception.updatedBy = userId;

    return this.exceptionRepository.save(exception);
  }

  async resolveException(id: string, resolution: string, userId?: string): Promise<Exception> {
    const exception = await this.findOne(id);
    if (!exception) {
      throw new NotFoundException(`Exception with ID ${id} not found`);
    }

    exception.status = 'resolved' as any;
    exception.resolution = resolution;
    exception.resolvedBy = userId;
    exception.resolvedAt = new Date();
    exception.updatedBy = userId;

    return this.exceptionRepository.save(exception);
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
}
