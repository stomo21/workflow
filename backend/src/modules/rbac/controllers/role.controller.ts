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
import { RoleService } from '../services/role.service';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';
import { ClerkAuthGuard } from '../../../common/guards/clerk-auth.guard';
import { CurrentUser } from '../../../common/decorators/user.decorator';
import { EventsGateway, EventType } from '../../../common/gateways/events.gateway';
import { QueryParams } from '../../../common/services/base.service';

@Controller('roles')
@UseGuards(ClerkAuthGuard)
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Get()
  async findAll(@Query() query: QueryParams) {
    return this.roleService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.roleService.findOne(id, ['permissions', 'users', 'groups']);
  }

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto, @CurrentUser() user: any) {
    const role = await this.roleService.createRole(createRoleDto);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_CREATED,
      'role',
      role.id,
      role,
      user?.sub,
    );
    return role;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @CurrentUser() user: any,
  ) {
    const role = await this.roleService.updateRole(id, updateRoleDto);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_UPDATED,
      'role',
      role.id,
      role,
      user?.sub,
    );
    return role;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.roleService.remove(id);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_DELETED,
      'role',
      id,
      { id },
      user?.sub,
    );
    return { message: 'Role deleted successfully' };
  }
}
