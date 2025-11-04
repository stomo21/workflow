import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { BaseService } from '../../../common/services/base.service';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';

@Injectable()
export class RoleService extends BaseService<Role> {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {
    super(roleRepository);
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create({
      name: createRoleDto.name,
      description: createRoleDto.description,
    });

    if (createRoleDto.permissionIds && createRoleDto.permissionIds.length > 0) {
      role.permissions = await this.permissionRepository.findBy({
        id: In(createRoleDto.permissionIds),
      });
    }

    return this.roleRepository.save(role);
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id, ['permissions']);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    if (updateRoleDto.name !== undefined) role.name = updateRoleDto.name;
    if (updateRoleDto.description !== undefined) role.description = updateRoleDto.description;

    if (updateRoleDto.permissionIds !== undefined) {
      role.permissions = await this.permissionRepository.findBy({
        id: In(updateRoleDto.permissionIds),
      });
    }

    return this.roleRepository.save(role);
  }
}
