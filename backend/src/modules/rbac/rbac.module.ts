import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Group } from './entities/group.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { UserService } from './services/user.service';
import { RoleService } from './services/role.service';
import { GroupService } from './services/group.service';
import { PermissionService } from './services/permission.service';
import { UserController } from './controllers/user.controller';
import { RoleController } from './controllers/role.controller';
import { GroupController } from './controllers/group.controller';
import { PermissionController } from './controllers/permission.controller';
import { EventsGateway } from '../../common/gateways/events.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User, Group, Role, Permission])],
  providers: [UserService, RoleService, GroupService, PermissionService, EventsGateway],
  controllers: [UserController, RoleController, GroupController, PermissionController],
  exports: [UserService, RoleService, GroupService, PermissionService],
})
export class RbacModule {}
