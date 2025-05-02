import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sizes } from './entity/sizes.entity';
import { Repository } from 'typeorm';
import { CreateSizeDto } from './dto/create-sizes.dto';

@Injectable()
export class SizesService {
  constructor(
    @InjectRepository(Sizes) private sizesRepository: Repository<Sizes>,
  ) {}
  async findAll(): Promise<Sizes[]> {
    try {
      const result = await this.sizesRepository.find();
      if (result.length === 0) {
        throw new NotFoundException('Sizes not found');
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Unexpected error fetching sizes');
    }
  }
  async findOne(id: number): Promise<Sizes | null> {
    try {
      return await this.sizesRepository.findOne({
        where: { id },
        
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Failed to retrieve Size with ID ${id}`,
      );
    }
  }
  async createSize(createSize: CreateSizeDto): Promise<Sizes> {
    try {
      const newSize = this.sizesRepository.create(createSize);
      if (!newSize) {
        throw new BadRequestException('Couldnt create new Size');
      }
      return this.sizesRepository.save(newSize);
    } catch (error) {
      console.error(error);
      if (error.code === '23505') {
        throw new ConflictException(`Size with name ${createSize.name}`);
      }
      throw new InternalServerErrorException(
        `Unexpected error at creating new Size ${createSize.name}`,
      );
    }
  }
  async updateSize(
    id: number,
    updateSize: CreateSizeDto,
  ): Promise<Sizes | null> {
    try {
      const result = await this.sizesRepository.update(id, updateSize);
      if (result.affected === 0) {
        throw new NotFoundException(`Size with ID ${id} not found`);
      }
      return this.sizesRepository.findOne({
        where: { id },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
  async deleteSize(id: number): Promise<{ message: string }> {
    try {
      const result = await this.sizesRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Couldnt delete Size with id ${id}`);
      }
      return { message: 'Successfully deleted Size' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Unexpected error deleting Size');
    }
  }
}
