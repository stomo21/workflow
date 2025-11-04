import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../entities/user.entity';
import { Group } from '../entities/group.entity';
import { Role } from '../entities/role.entity';
import { BaseService } from '../../../common/services/base.service';
import { CreateUserDto, UpdateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {
    super(userRepository);
  }

  async findByClerkId(clerkId: string): Promise<User> {
    return this.userRepository.findOne({
      where: { clerkId },
      relations: ['groups', 'roles', 'roles.permissions'],
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['groups', 'roles', 'roles.permissions'],
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      clerkId: createUserDto.clerkId,
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      imageUrl: createUserDto.imageUrl,
    });

    if (createUserDto.groupIds && createUserDto.groupIds.length > 0) {
      user.groups = await this.groupRepository.findBy({
        id: In(createUserDto.groupIds),
      });
    }

    if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
      user.roles = await this.roleRepository.findBy({
        id: In(createUserDto.roleIds),
      });
    }

    return this.userRepository.save(user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id, ['groups', 'roles']);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.firstName !== undefined) user.firstName = updateUserDto.firstName;
    if (updateUserDto.lastName !== undefined) user.lastName = updateUserDto.lastName;
    if (updateUserDto.imageUrl !== undefined) user.imageUrl = updateUserDto.imageUrl;

    if (updateUserDto.groupIds !== undefined) {
      user.groups = await this.groupRepository.findBy({
        id: In(updateUserDto.groupIds),
      });
    }

    if (updateUserDto.roleIds !== undefined) {
      user.roles = await this.roleRepository.findBy({
        id: In(updateUserDto.roleIds),
      });
    }

    return this.userRepository.save(user);
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions', 'groups', 'groups.roles', 'groups.roles.permissions'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const permissions = new Set<string>();

    // Add permissions from direct roles
    user.roles?.forEach((role) => {
      role.permissions?.forEach((permission) => {
        permissions.add(`${permission.action}:${permission.resource}`);
      });
    });

    // Add permissions from group roles
    user.groups?.forEach((group) => {
      group.roles?.forEach((role) => {
        role.permissions?.forEach((permission) => {
          permissions.add(`${permission.action}:${permission.resource}`);
        });
      });
    });

    return Array.from(permissions);
  }
}
