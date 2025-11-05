import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { BaseService } from '../../../common/services/base.service';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';
import { EventsGateway, EventType } from '../../../common/gateways/events.gateway';

@Injectable()
export class RoleService extends BaseService<Role> {
  protected entityName = 'role';

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    private eventsGateway: EventsGateway,
  ) {
    super(roleRepository, eventsGateway);
  }

  async createRole(createRoleDto: CreateRoleDto, userId?: string): Promise<Role> {
    const role = this.roleRepository.create({
      name: createRoleDto.name,
      description: createRoleDto.description,
      createdBy: userId,
    });

    if (createRoleDto.permissionIds && createRoleDto.permissionIds.length > 0) {
      role.permissions = await this.permissionRepository.findBy({
        id: In(createRoleDto.permissionIds),
      });
    }

    const savedRole = await this.roleRepository.save(role);
    this.notifyChange(EventType.ENTITY_CREATED, savedRole.id, savedRole, userId);
    return savedRole;
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto, userId?: string): Promise<Role> {
    const role = await this.findOne(id, ['permissions']);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    if (updateRoleDto.name !== undefined) role.name = updateRoleDto.name;
    if (updateRoleDto.description !== undefined) role.description = updateRoleDto.description;
    role.updatedBy = userId;

    if (updateRoleDto.permissionIds !== undefined) {
      role.permissions = await this.permissionRepository.findBy({
        id: In(updateRoleDto.permissionIds),
      });
    }

    const savedRole = await this.roleRepository.save(role);
    this.notifyChange(EventType.ENTITY_UPDATED, savedRole.id, savedRole, userId);
    return savedRole;
  }
}
