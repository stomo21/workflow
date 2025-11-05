import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { BaseService } from '../../../common/services/base.service';
import { CreatePermissionDto, UpdatePermissionDto } from '../dto/permission.dto';
import { EventsGateway, EventType } from '../../../common/gateways/events.gateway';

@Injectable()
export class PermissionService extends BaseService<Permission> {
  protected entityName = 'permission';

  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    private eventsGateway: EventsGateway,
  ) {
    super(permissionRepository, eventsGateway);
  }

  async createPermission(createPermissionDto: CreatePermissionDto, userId?: string): Promise<Permission> {
    const permission = this.permissionRepository.create({
      ...createPermissionDto,
      createdBy: userId,
    });

    const savedPermission = await this.permissionRepository.save(permission);
    this.notifyChange(EventType.ENTITY_CREATED, savedPermission.id, savedPermission, userId);
    return savedPermission;
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

    const savedPermission = await this.permissionRepository.save(permission);
    this.notifyChange(EventType.ENTITY_UPDATED, savedPermission.id, savedPermission, userId);
    return savedPermission;
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
