import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
import { QueryParams } from '../../../common/services/base.service';

@Controller('exceptions')
@UseGuards(ClerkAuthGuard)
export class ExceptionController {
  constructor(
    private readonly exceptionService: ExceptionService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Get()
  async findAll(@Query() query: QueryParams) {
    return this.exceptionService.findAll(query);
  }

  @Get('type/:type')
  async findByType(@Param('type') type: string, @Query() query: QueryParams) {
    return this.exceptionService.findByType(type, query);
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string, @Query() query: QueryParams) {
    return this.exceptionService.findByStatus(status, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.exceptionService.findOne(id, ['approval']);
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

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.exceptionService.removeWithNotification(id, user?.sub);
    return { message: 'Exception deleted successfully' };
  }
}
