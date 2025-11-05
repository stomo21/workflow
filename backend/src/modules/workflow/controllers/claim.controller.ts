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
import { ClaimService } from '../services/claim.service';
import { CreateClaimDto, UpdateClaimDto } from '../dto/claim.dto';
import { ClerkAuthGuard } from '../../../common/guards/clerk-auth.guard';
import { CurrentUser } from '../../../common/decorators/user.decorator';
import { EventsGateway, EventType } from '../../../common/gateways/events.gateway';
import { QueryParams } from '../../../common/services/base.service';

@Controller('claims')
@UseGuards(ClerkAuthGuard)
export class ClaimController {
  constructor(
    private readonly claimService: ClaimService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Get()
  async findAll(@Query() query: QueryParams) {
    return this.claimService.findAll(query);
  }

  @Get('available')
  async findAvailable(@Query() query: QueryParams) {
    return this.claimService.findAvailable(query);
  }

  @Get('my-claims')
  async findMyClaims(@Query() query: QueryParams, @CurrentUser() user: any) {
    return this.claimService.findByUser(user.sub, query);
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string, @Query() query: QueryParams) {
    return this.claimService.findByStatus(status, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.claimService.findOne(id, ['claimedBy']);
  }

  @Post()
  async create(@Body() createClaimDto: CreateClaimDto, @CurrentUser() user: any) {
    return this.claimService.createClaim(createClaimDto, user?.sub);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClaimDto: UpdateClaimDto,
    @CurrentUser() user: any,
  ) {
    const claim = await this.claimService.updateClaim(id, updateClaimDto, user?.sub);

    // Domain-specific event for claim updates
    this.eventsGateway.notifyEntityChange(
      EventType.CLAIM_UPDATED,
      'claim',
      claim.id,
      claim,
      user?.sub,
    );

    return claim;
  }

  @Post(':id/claim')
  async claimWorkItem(@Param('id') id: string, @CurrentUser() user: any) {
    const claim = await this.claimService.claimWorkItem(id, user.sub);

    // Domain-specific event for work item claimed
    this.eventsGateway.notifyEntityChange(
      EventType.CLAIM_UPDATED,
      'claim',
      claim.id,
      claim,
      user?.sub,
    );

    return claim;
  }

  @Post(':id/complete')
  async complete(@Param('id') id: string, @CurrentUser() user: any) {
    const claim = await this.claimService.completeClaim(id, user?.sub);

    // Domain-specific event for claim completion
    this.eventsGateway.notifyEntityChange(
      EventType.CLAIM_UPDATED,
      'claim',
      claim.id,
      claim,
      user?.sub,
    );

    return claim;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.claimService.removeWithNotification(id, user?.sub);
    return { message: 'Claim deleted successfully' };
  }
}
