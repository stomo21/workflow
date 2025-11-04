import { Repository, FindOptionsWhere, ILike, FindManyOptions } from 'typeorm';
import { BaseEntity } from '../entities/base.entity';

export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
  searchFields?: string[];
  filters?: Record<string, any>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class BaseService<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  async findAll(queryParams: QueryParams = {}): Promise<PaginatedResult<T>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      search,
      searchFields = [],
      filters = {},
    } = queryParams;

    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<T> | FindOptionsWhere<T>[] = {};

    // Apply search
    if (search && searchFields.length > 0) {
      const searchConditions = searchFields.map((field) => ({
        [field]: ILike(`%${search}%`),
      }));
      Object.assign(where, searchConditions);
    }

    // Apply filters
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null) {
        where[key] = filters[key];
      }
    });

    const findOptions: FindManyOptions<T> = {
      where,
      take: limit,
      skip,
      order: { [sortBy]: sortOrder } as any,
    };

    const [data, total] = await this.repository.findAndCount(findOptions);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, relations: string[] = []): Promise<T> {
    return this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
      relations,
    });
  }

  async create(createDto: Partial<T>, userId?: string): Promise<T> {
    const entity = this.repository.create({
      ...createDto,
      createdBy: userId,
    } as any);
    return this.repository.save(entity);
  }

  async update(id: string, updateDto: Partial<T>, userId?: string): Promise<T> {
    await this.repository.update(id, {
      ...updateDto,
      updatedBy: userId,
    } as any);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.repository.restore(id);
  }
}
