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
import { QueryParams } from '../../../common/services/base.service';

@Controller('permissions')
@UseGuards(ClerkAuthGuard)
export class PermissionController {
  constructor(
    private readonly permissionService: PermissionService,
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

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.permissionService.removeWithNotification(id, user?.sub);
    return { message: 'Permission deleted successfully' };
  }
}
