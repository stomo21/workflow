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
import { QueryParams } from '../../../common/services/base.service';

@Controller('roles')
@UseGuards(ClerkAuthGuard)
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
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
    return this.roleService.createRole(createRoleDto, user?.sub);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @CurrentUser() user: any,
  ) {
    return this.roleService.updateRole(id, updateRoleDto, user?.sub);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.roleService.removeWithNotification(id, user?.sub);
    return { message: 'Role deleted successfully' };
  }
}
