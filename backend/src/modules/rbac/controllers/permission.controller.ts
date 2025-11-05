import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PermissionService } from '../services/permission.service';
import { CreatePermissionDto, UpdatePermissionDto } from '../dto/permission.dto';
import { ClerkAuthGuard } from '../../../common/guards/clerk-auth.guard';
import { CurrentUser } from '../../../common/decorators/user.decorator';
import { BaseController } from '../../../common/controllers/base.controller';
import { Permission } from '../entities/permission.entity';

@Controller('permissions')
@UseGuards(ClerkAuthGuard)
export class PermissionController extends BaseController<Permission> {
  constructor(
    private readonly permissionService: PermissionService,
  ) {
    super(permissionService, 'Permission');
  }

  protected getRelations(): string[] {
    return ['roles'];
  }

  @Get('action/:action')
  async findByAction(@Param('action') action: string) {
    return this.permissionService.findByAction(action);
  }

  @Get('resource/:resource')
  async findByResource(@Param('resource') resource: string) {
    return this.permissionService.findByResource(resource);
  }

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto, @CurrentUser() user: any) {
    return this.permissionService.createPermission(createPermissionDto, user?.sub);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @CurrentUser() user: any,
  ) {
    return this.permissionService.updatePermission(id, updatePermissionDto, user?.sub);
  }
}
