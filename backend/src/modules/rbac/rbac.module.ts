import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Group } from './entities/group.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { UserService } from './services/user.service';
import { RoleService } from './services/role.service';
import { UserController } from './controllers/user.controller';
import { RoleController } from './controllers/role.controller';
import { EventsGateway } from '../../common/gateways/events.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User, Group, Role, Permission])],
  providers: [UserService, RoleService, EventsGateway],
  controllers: [UserController, RoleController],
  exports: [UserService, RoleService],
})
export class RbacModule {}
