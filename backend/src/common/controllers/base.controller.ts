import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { BaseService, QueryParams } from '../services/base.service';
import { BaseEntity } from '../entities/base.entity';
import { CurrentUser } from '../decorators/user.decorator';

export abstract class BaseController<T extends BaseEntity> {
  constructor(
    protected readonly service: BaseService<T>,
    protected readonly entityName: string,
  ) {}

  @Get()
  async findAll(@Query() query: QueryParams) {
    return this.service.findAll(query);
  }

  @Get('filters/aggregations')
  async getFilterAggregations(@Query('fields') fields: string) {
    const fieldArray = fields ? fields.split(',') : this.getFilterFields();
    return this.service.getFilterAggregations(fieldArray);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id, this.getRelations());
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.service.removeWithNotification(id, user?.sub);
    return { message: `${this.entityName} deleted successfully` };
  }

  // Override this method in child controllers to specify relations for findOne
  protected getRelations(): string[] {
    return [];
  }

  // Override this method in child controllers to specify fields for filter aggregations
  protected getFilterFields(): string[] {
    return [];
  }

  // Child controllers should implement create and update methods
  // since they have different method names in services (createUser, createRole, etc.)
}
