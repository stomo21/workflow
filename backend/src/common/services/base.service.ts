import { Repository, FindOptionsWhere, ILike, FindManyOptions, In } from 'typeorm';
import { BaseEntity } from '../entities/base.entity';
import { EventsGateway, EventType } from '../gateways/events.gateway';

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

export interface FilterOption {
  value: any;
  label: string;
  count: number;
}

export interface FilterAggregation {
  field: string;
  options: FilterOption[];
}

export abstract class BaseService<T extends BaseEntity> {
  protected abstract entityName: string;

  constructor(
    protected readonly repository: Repository<T>,
    protected readonly eventsGateway?: EventsGateway,
  ) {}

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

    // Apply filters (support both single values and arrays)
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value) && value.length > 0) {
          where[key] = In(value);
        } else if (!Array.isArray(value)) {
          where[key] = value;
        }
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

  // Get filter aggregations for specified fields
  async getFilterAggregations(fields: string[]): Promise<FilterAggregation[]> {
    const aggregations: FilterAggregation[] = [];

    for (const field of fields) {
      const query = this.repository
        .createQueryBuilder('entity')
        .select(`entity.${field}`, 'value')
        .addSelect('COUNT(*)', 'count')
        .where(`entity.${field} IS NOT NULL`)
        .groupBy(`entity.${field}`)
        .orderBy('count', 'DESC');

      const results = await query.getRawMany();

      aggregations.push({
        field,
        options: results.map((r) => ({
          value: r.value,
          label: String(r.value),
          count: parseInt(r.count, 10),
        })),
      });
    }

    return aggregations;
  }

  // Enhanced methods with event notifications
  async createWithNotification(createDto: Partial<T>, userId?: string): Promise<T> {
    const entity = await this.create(createDto, userId);
    this.notifyChange(EventType.ENTITY_CREATED, entity.id, entity, userId);
    return entity;
  }

  async updateWithNotification(id: string, updateDto: Partial<T>, userId?: string): Promise<T> {
    const entity = await this.update(id, updateDto, userId);
    this.notifyChange(EventType.ENTITY_UPDATED, entity.id, entity, userId);
    return entity;
  }

  async removeWithNotification(id: string, userId?: string): Promise<void> {
    await this.remove(id);
    this.notifyChange(EventType.ENTITY_DELETED, id, { id }, userId);
  }

  protected notifyChange(eventType: EventType, entityId: string, data: any, userId?: string): void {
    if (this.eventsGateway) {
      this.eventsGateway.notifyEntityChange(
        eventType,
        this.entityName,
        entityId,
        data,
        userId,
      );
    }
  }
}
