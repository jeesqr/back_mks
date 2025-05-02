import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from './entity/roles.entity';
import { Repository } from 'typeorm';
import { CreateRolesDto } from './dto/create-roles.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles) private rolesRepository: Repository<Roles>,
  ) {}
  async findAll(): Promise<Roles[]> {
    try {
      const result = await this.rolesRepository.find();
      if (result.length === 0) {
        throw new NotFoundException('Roles not founded');
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Unexpected error fetching roles');
    }
  }
  async findOne(id: number): Promise<Roles | null> {
    try {
      return await this.rolesRepository.findOne({
        where: { id },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Failed to retrieve Role with ID ${id}`,
      );
    }
  }
  async createRoles(createRole: CreateRolesDto): Promise<Roles> {
    try {
      const newRole = this.rolesRepository.create(createRole);
      if (!newRole) {
        throw new BadRequestException('Couldnt create new Role');
      }
      return this.rolesRepository.save(newRole);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Unexpected error at creating new Role ${createRole}`,
      );
    }
  }
  async updateRole(
    id: number,
    updateRole: CreateRolesDto,
  ): Promise<Roles | null> {
    try {
      const result = await this.rolesRepository.update(id, updateRole);
      if (result.affected === 0) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }
      return this.rolesRepository.findOne({
        where: { id },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
  async deleteRole(id: number): Promise<{ message: string }> {
    try {
      const result = await this.rolesRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Couldnt delete Role with id ${id}`);
      }
      return { message: 'Successfully deleted Role' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Unexpected error deleting Role');
    }
  }
}
