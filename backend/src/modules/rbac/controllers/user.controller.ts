import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto/create-user.dto';
import { ClerkAuthGuard } from '../../../common/guards/clerk-auth.guard';
import { CurrentUser } from '../../../common/decorators/user.decorator';
import { BaseController } from '../../../common/controllers/base.controller';
import { User } from '../entities/user.entity';

@Controller('users')
@UseGuards(ClerkAuthGuard)
export class UserController extends BaseController<User> {
  constructor(
    private readonly userService: UserService,
  ) {
    super(userService, 'User');
  }

  protected getRelations(): string[] {
    return ['groups', 'roles', 'roles.permissions'];
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
}
