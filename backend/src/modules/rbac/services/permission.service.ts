import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { BaseService } from '../../../common/services/base.service';
import { CreatePermissionDto, UpdatePermissionDto } from '../dto/permission.dto';

@Injectable()
export class PermissionService extends BaseService<Permission> {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {
    super(permissionRepository);
  }

  async createPermission(createPermissionDto: CreatePermissionDto, userId?: string): Promise<Permission> {
    const permission = this.permissionRepository.create({
      ...createPermissionDto,
      createdBy: userId,
    });

    return this.permissionRepository.save(permission);
  }

  async updatePermission(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
    userId?: string,
  ): Promise<Permission> {
    const permission = await this.findOne(id);
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    Object.assign(permission, updatePermissionDto);
    permission.updatedBy = userId;

    return this.permissionRepository.save(permission);
  }

  async findByAction(action: string): Promise<Permission[]> {
    return this.permissionRepository.find({
      where: { action: action as any },
    });
  }

  async findByResource(resource: string): Promise<Permission[]> {
    return this.permissionRepository.find({
      where: { resource: resource as any },
    });
  }
}
