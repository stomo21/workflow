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
import { PatternService } from '../services/pattern.service';
import { CreatePatternDto, UpdatePatternDto } from '../dto/pattern.dto';
import { ClerkAuthGuard } from '../../../common/guards/clerk-auth.guard';
import { CurrentUser } from '../../../common/decorators/user.decorator';
import { EventsGateway, EventType } from '../../../common/gateways/events.gateway';
import { QueryParams } from '../../../common/services/base.service';

@Controller('patterns')
@UseGuards(ClerkAuthGuard)
export class PatternController {
  constructor(
    private readonly patternService: PatternService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Get()
  async findAll(@Query() query: QueryParams) {
    return this.patternService.findAll(query);
  }

  @Get('type/:type')
  async findByType(@Param('type') type: string, @Query() query: QueryParams) {
    return this.patternService.findByType(type, query);
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string, @Query() query: QueryParams) {
    return this.patternService.findByStatus(status, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.patternService.findOne(id, ['approvals']);
  }

  @Post()
  async create(@Body() createPatternDto: CreatePatternDto, @CurrentUser() user: any) {
    const pattern = await this.patternService.createPattern(createPatternDto, user?.sub);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_CREATED,
      'pattern',
      pattern.id,
      pattern,
      user?.sub,
    );
    return pattern;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePatternDto: UpdatePatternDto,
    @CurrentUser() user: any,
  ) {
    const pattern = await this.patternService.updatePattern(id, updatePatternDto, user?.sub);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_UPDATED,
      'pattern',
      pattern.id,
      pattern,
      user?.sub,
    );
    return pattern;
  }

  @Post(':id/activate')
  async activate(@Param('id') id: string, @CurrentUser() user: any) {
    const pattern = await this.patternService.activatePattern(id, user?.sub);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_UPDATED,
      'pattern',
      pattern.id,
      pattern,
      user?.sub,
    );
    return pattern;
  }

  @Post(':id/deactivate')
  async deactivate(@Param('id') id: string, @CurrentUser() user: any) {
    const pattern = await this.patternService.deactivatePattern(id, user?.sub);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_UPDATED,
      'pattern',
      pattern.id,
      pattern,
      user?.sub,
    );
    return pattern;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.patternService.remove(id);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_DELETED,
      'pattern',
      id,
      { id },
      user?.sub,
    );
    return { message: 'Pattern deleted successfully' };
  }
}
