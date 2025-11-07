import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from '../services/group.service';
import { CreateGroupDto, UpdateGroupDto } from '../dto/group.dto';
import { ClerkAuthGuard } from '../../../common/guards/clerk-auth.guard';
import { CurrentUser } from '../../../common/decorators/user.decorator';
import { BaseController } from '../../../common/controllers/base.controller';
import { Group } from '../entities/group.entity';

@Controller('groups')
@UseGuards(ClerkAuthGuard)
export class GroupController extends BaseController<Group> {
  constructor(
    private readonly groupService: GroupService,
  ) {
    super(groupService, 'Group');
  }

  protected getRelations(): string[] {
    return ['users', 'roles'];
  }

  protected getFilterFields(): string[] {
    return ['isActive'];
  }

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto, @CurrentUser() user: any) {
    return this.groupService.createGroup(createGroupDto, user?.sub);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @CurrentUser() user: any,
  ) {
    return this.groupService.updateGroup(id, updateGroupDto, user?.sub);
  }

  @Post(':groupId/users/:userId')
  async addUserToGroup(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ) {
    return this.groupService.addUserToGroup(groupId, userId, user?.sub);
  }

  @Delete(':groupId/users/:userId')
  async removeUserFromGroup(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ) {
    return this.groupService.removeUserFromGroup(groupId, userId, user?.sub);
  }

  @Post(':groupId/roles/:roleId')
  async addRoleToGroup(
    @Param('groupId') groupId: string,
    @Param('roleId') roleId: string,
    @CurrentUser() user: any,
  ) {
    return this.groupService.addRoleToGroup(groupId, roleId, user?.sub);
  }

  @Delete(':groupId/roles/:roleId')
  async removeRoleFromGroup(
    @Param('groupId') groupId: string,
    @Param('roleId') roleId: string,
    @CurrentUser() user: any,
  ) {
    return this.groupService.removeRoleFromGroup(groupId, roleId, user?.sub);
  }
}
