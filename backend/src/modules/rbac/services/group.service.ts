import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../entities/group.entity';
import { Role } from '../entities/role.entity';
import { BaseService } from '../../../common/services/base.service';
import { CreateGroupDto, UpdateGroupDto } from '../dto/group.dto';
import { EventsGateway, EventType } from '../../../common/gateways/events.gateway';

@Injectable()
export class GroupService extends BaseService<Group> {
  protected entityName = 'group';

  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private eventsGateway: EventsGateway,
  ) {
    super(groupRepository, eventsGateway);
  }

  async createGroup(createGroupDto: CreateGroupDto, userId?: string): Promise<Group> {
    const group = this.groupRepository.create({
      ...createGroupDto,
      createdBy: userId,
    });

    const savedGroup = await this.groupRepository.save(group);
    this.notifyChange(EventType.ENTITY_CREATED, savedGroup.id, savedGroup, userId);
    return savedGroup;
  }

  async updateGroup(id: string, updateGroupDto: UpdateGroupDto, userId?: string): Promise<Group> {
    const group = await this.findOne(id);
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    Object.assign(group, updateGroupDto);
    group.updatedBy = userId;

    const savedGroup = await this.groupRepository.save(group);
    this.notifyChange(EventType.ENTITY_UPDATED, savedGroup.id, savedGroup, userId);
    return savedGroup;
  }

  async addUserToGroup(groupId: string, userId: string, requestUserId?: string): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['users'],
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    // Add user if not already in group
    if (!group.users.find((u) => u.id === userId)) {
      group.users.push({ id: userId } as any);
      await this.groupRepository.save(group);
    }

    const updatedGroup = await this.findOne(groupId, ['users', 'roles']);
    this.notifyChange(EventType.ENTITY_UPDATED, updatedGroup.id, updatedGroup, requestUserId);
    return updatedGroup;
  }

  async removeUserFromGroup(groupId: string, userId: string, requestUserId?: string): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['users'],
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    group.users = group.users.filter((u) => u.id !== userId);
    await this.groupRepository.save(group);

    const updatedGroup = await this.findOne(groupId, ['users', 'roles']);
    this.notifyChange(EventType.ENTITY_UPDATED, updatedGroup.id, updatedGroup, requestUserId);
    return updatedGroup;
  }

  async addRoleToGroup(groupId: string, roleId: string, requestUserId?: string): Promise<Group> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['groups'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    // Add group to role if not already assigned
    if (!role.groups.find((g) => g.id === groupId)) {
      role.groups.push(group);
      await this.roleRepository.save(role);
    }

    const updatedGroup = await this.findOne(groupId, ['users', 'roles', 'roles.permissions']);
    this.notifyChange(EventType.ENTITY_UPDATED, updatedGroup.id, updatedGroup, requestUserId);
    return updatedGroup;
  }

  async removeRoleFromGroup(groupId: string, roleId: string, requestUserId?: string): Promise<Group> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['groups'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    role.groups = role.groups.filter((g) => g.id !== groupId);
    await this.roleRepository.save(role);

    const updatedGroup = await this.findOne(groupId, ['users', 'roles', 'roles.permissions']);
    this.notifyChange(EventType.ENTITY_UPDATED, updatedGroup.id, updatedGroup, requestUserId);
    return updatedGroup;
  }
}
