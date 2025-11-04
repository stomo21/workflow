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
import { PermissionService } from '../services/permission.service';
import { CreatePermissionDto, UpdatePermissionDto } from '../dto/permission.dto';
import { ClerkAuthGuard } from '../../../common/guards/clerk-auth.guard';
import { CurrentUser } from '../../../common/decorators/user.decorator';
import { EventsGateway, EventType } from '../../../common/gateways/events.gateway';
import { QueryParams } from '../../../common/services/base.service';

@Controller('permissions')
@UseGuards(ClerkAuthGuard)
export class PermissionController {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Get()
  async findAll(@Query() query: QueryParams) {
    return this.permissionService.findAll(query);
  }

  @Get('action/:action')
  async findByAction(@Param('action') action: string) {
    return this.permissionService.findByAction(action);
  }

  @Get('resource/:resource')
  async findByResource(@Param('resource') resource: string) {
    return this.permissionService.findByResource(resource);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id, ['roles']);
  }

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto, @CurrentUser() user: any) {
    const permission = await this.permissionService.createPermission(createPermissionDto, user?.sub);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_CREATED,
      'permission',
      permission.id,
      permission,
      user?.sub,
    );
    return permission;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @CurrentUser() user: any,
  ) {
    const permission = await this.permissionService.updatePermission(id, updatePermissionDto, user?.sub);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_UPDATED,
      'permission',
      permission.id,
      permission,
      user?.sub,
    );
    return permission;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.permissionService.remove(id);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_DELETED,
      'permission',
      id,
      { id },
      user?.sub,
    );
    return { message: 'Permission deleted successfully' };
  }
}
