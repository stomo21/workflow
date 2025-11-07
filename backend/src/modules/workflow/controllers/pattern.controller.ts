import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PatternService } from '../services/pattern.service';
import { CreatePatternDto, UpdatePatternDto } from '../dto/pattern.dto';
import { ClerkAuthGuard } from '../../../common/guards/clerk-auth.guard';
import { CurrentUser } from '../../../common/decorators/user.decorator';
import { BaseController } from '../../../common/controllers/base.controller';
import { Pattern } from '../entities/pattern.entity';
import { QueryParams } from '../../../common/services/base.service';

@Controller('patterns')
@UseGuards(ClerkAuthGuard)
export class PatternController extends BaseController<Pattern> {
  constructor(
    private readonly patternService: PatternService,
  ) {
    super(patternService, 'Pattern');
  }

  protected getRelations(): string[] {
    return ['approvals'];
  }

  protected getFilterFields(): string[] {
    return ['type', 'status'];
  }

  @Get('type/:type')
  async findByType(@Param('type') type: string, @Query() query: QueryParams) {
    return this.patternService.findByType(type, query);
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string, @Query() query: QueryParams) {
    return this.patternService.findByStatus(status, query);
  }

  @Post()
  async create(@Body() createPatternDto: CreatePatternDto, @CurrentUser() user: any) {
    return this.patternService.createPattern(createPatternDto, user?.sub);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePatternDto: UpdatePatternDto,
    @CurrentUser() user: any,
  ) {
    return this.patternService.updatePattern(id, updatePatternDto, user?.sub);
  }

  @Post(':id/activate')
  async activate(@Param('id') id: string, @CurrentUser() user: any) {
    return this.patternService.activatePattern(id, user?.sub);
  }

  @Post(':id/deactivate')
  async deactivate(@Param('id') id: string, @CurrentUser() user: any) {
    return this.patternService.deactivatePattern(id, user?.sub);
  }
}
