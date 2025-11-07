import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ExceptionService } from '../services/exception.service';
import { CreateExceptionDto, UpdateExceptionDto } from '../dto/exception.dto';
import { ClerkAuthGuard } from '../../../common/guards/clerk-auth.guard';
import { CurrentUser } from '../../../common/decorators/user.decorator';
import { EventsGateway, EventType } from '../../../common/gateways/events.gateway';
import { BaseController } from '../../../common/controllers/base.controller';
import { Exception } from '../entities/exception.entity';
import { QueryParams } from '../../../common/services/base.service';

@Controller('exceptions')
@UseGuards(ClerkAuthGuard)
export class ExceptionController extends BaseController<Exception> {
  constructor(
    private readonly exceptionService: ExceptionService,
    private readonly eventsGateway: EventsGateway,
  ) {
    super(exceptionService, 'Exception');
  }

  protected getRelations(): string[] {
    return ['approval'];
  }

  protected getFilterFields(): string[] {
    return ['type', 'status'];
  }

  @Get('type/:type')
  async findByType(@Param('type') type: string, @Query() query: QueryParams) {
    return this.exceptionService.findByType(type, query);
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string, @Query() query: QueryParams) {
    return this.exceptionService.findByStatus(status, query);
  }

  @Post()
  async create(@Body() createExceptionDto: CreateExceptionDto, @CurrentUser() user: any) {
    const exception = await this.exceptionService.createException(createExceptionDto, user?.sub);

    // Domain-specific event for exception raised
    this.eventsGateway.notifyEntityChange(
      EventType.EXCEPTION_RAISED,
      'exception',
      exception.id,
      exception,
      user?.sub,
    );

    return exception;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateExceptionDto: UpdateExceptionDto,
    @CurrentUser() user: any,
  ) {
    return this.exceptionService.updateException(id, updateExceptionDto, user?.sub);
  }

  @Post(':id/resolve')
  async resolve(
    @Param('id') id: string,
    @Body() body: { resolution: string },
    @CurrentUser() user: any,
  ) {
    return this.exceptionService.resolveException(id, body.resolution, user?.sub);
  }
}
