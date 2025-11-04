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
import { EventsGateway, EventType } from '../../../common/gateways/events.gateway';
import { QueryParams } from '../../../common/services/base.service';

@Controller('users')
@UseGuards(ClerkAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly eventsGateway: EventsGateway,
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
    const newUser = await this.userService.createUser(createUserDto);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_CREATED,
      'user',
      newUser.id,
      newUser,
      user?.sub,
    );
    return newUser;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: any,
  ) {
    const updatedUser = await this.userService.updateUser(id, updateUserDto);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_UPDATED,
      'user',
      updatedUser.id,
      updatedUser,
      user?.sub,
    );
    return updatedUser;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.userService.remove(id);
    this.eventsGateway.notifyEntityChange(
      EventType.ENTITY_DELETED,
      'user',
      id,
      { id },
      user?.sub,
    );
    return { message: 'User deleted successfully' };
  }
}
