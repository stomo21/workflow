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
import { GroupService } from '../services/group.service';
import { CreateGroupDto, UpdateGroupDto } from '../dto/group.dto';
import { ClerkAuthGuard } from '../../../common/guards/clerk-auth.guard';
import { CurrentUser } from '../../../common/decorators/user.decorator';
import { EventsGateway, EventType } from '../../../common/gateways/events.gateway';
import { QueryParams } from '../../../common/services/base.service';

@Controller('groups')
@UseGuards(ClerkAuthGuard)
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Get()
  async findAll(@Query() query: QueryParams) {
    return this.groupService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.groupService.findOne(id, ['users', 'roles']);
  }

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto, @CurrentUser() user: any) {
    const group = await this.groupService.createGroup(createGroupDto, user?.sub);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_CREATED,
      'group',
      group.id,
      group,
      user?.sub,
    );
    return group;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @CurrentUser() user: any,
  ) {
    const group = await this.groupService.updateGroup(id, updateGroupDto, user?.sub);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_UPDATED,
      'group',
      group.id,
      group,
      user?.sub,
    );
    return group;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.groupService.remove(id);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_DELETED,
      'group',
      id,
      { id },
      user?.sub,
    );
    return { message: 'Group deleted successfully' };
  }

  @Post(':groupId/users/:userId')
  async addUserToGroup(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ) {
    const group = await this.groupService.addUserToGroup(groupId, userId);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_UPDATED,
      'group',
      group.id,
      group,
      user?.sub,
    );
    return group;
  }

  @Delete(':groupId/users/:userId')
  async removeUserFromGroup(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ) {
    const group = await this.groupService.removeUserFromGroup(groupId, userId);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_UPDATED,
      'group',
      group.id,
      group,
      user?.sub,
    );
    return group;
  }

  @Post(':groupId/roles/:roleId')
  async addRoleToGroup(
    @Param('groupId') groupId: string,
    @Param('roleId') roleId: string,
    @CurrentUser() user: any,
  ) {
    const group = await this.groupService.addRoleToGroup(groupId, roleId);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_UPDATED,
      'group',
      group.id,
      group,
      user?.sub,
    );
    return group;
  }

  @Delete(':groupId/roles/:roleId')
  async removeRoleFromGroup(
    @Param('groupId') groupId: string,
    @Param('roleId') roleId: string,
    @CurrentUser() user: any,
  ) {
    const group = await this.groupService.removeRoleFromGroup(groupId, roleId);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_UPDATED,
      'group',
      group.id,
      group,
      user?.sub,
    );
    return group;
  }
}
