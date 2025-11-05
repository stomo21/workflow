import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';
import { ClerkAuthGuard } from '../../../common/guards/clerk-auth.guard';
import { CurrentUser } from '../../../common/decorators/user.decorator';
import { BaseController } from '../../../common/controllers/base.controller';
import { Role } from '../entities/role.entity';

@Controller('roles')
@UseGuards(ClerkAuthGuard)
export class RoleController extends BaseController<Role> {
  constructor(
    private readonly roleService: RoleService,
  ) {
    super(roleService, 'Role');
  }

  protected getRelations(): string[] {
    return ['permissions', 'users', 'groups'];
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
}
