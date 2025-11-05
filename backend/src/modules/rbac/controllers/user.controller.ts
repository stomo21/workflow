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
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto/create-user.dto';
import { ClerkAuthGuard } from '../../../common/guards/clerk-auth.guard';
import { CurrentUser } from '../../../common/decorators/user.decorator';
import { QueryParams } from '../../../common/services/base.service';

@Controller('users')
@UseGuards(ClerkAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  async findAll(@Query() query: QueryParams) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id, ['groups', 'roles', 'roles.permissions']);
  }

  @Get(':id/permissions')
  async getUserPermissions(@Param('id') id: string) {
    return this.userService.getUserPermissions(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @CurrentUser() user: any) {
    return this.userService.createUser(createUserDto, user?.sub);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: any,
  ) {
    return this.userService.updateUser(id, updateUserDto, user?.sub);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.userService.removeWithNotification(id, user?.sub);
    return { message: 'User deleted successfully' };
  }
}
