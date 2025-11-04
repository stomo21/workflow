import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../entities/group.entity';
import { BaseService } from '../../../common/services/base.service';
import { CreateGroupDto, UpdateGroupDto } from '../dto/group.dto';

@Injectable()
export class GroupService extends BaseService<Group> {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) {
    super(groupRepository);
  }

  async createGroup(createGroupDto: CreateGroupDto, userId?: string): Promise<Group> {
    const group = this.groupRepository.create({
      ...createGroupDto,
      createdBy: userId,
    });

    return this.groupRepository.save(group);
  }

  async updateGroup(id: string, updateGroupDto: UpdateGroupDto, userId?: string): Promise<Group> {
    const group = await this.findOne(id);
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    Object.assign(group, updateGroupDto);
    group.updatedBy = userId;

    return this.groupRepository.save(group);
  }

  async addUserToGroup(groupId: string, userId: string): Promise<Group> {
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

    return this.findOne(groupId, ['users', 'roles']);
  }

  async removeUserFromGroup(groupId: string, userId: string): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['users'],
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    group.users = group.users.filter((u) => u.id !== userId);
    await this.groupRepository.save(group);

    return this.findOne(groupId, ['users', 'roles']);
  }
}
