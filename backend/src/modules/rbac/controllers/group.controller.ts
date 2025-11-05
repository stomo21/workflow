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
import { QueryParams } from '../../../common/services/base.service';

@Controller('groups')
@UseGuards(ClerkAuthGuard)
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
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

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.groupService.removeWithNotification(id, user?.sub);
    return { message: 'Group deleted successfully' };
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
