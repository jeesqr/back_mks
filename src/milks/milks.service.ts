import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Milks } from './entity/milks.entity';
import { Repository } from 'typeorm';
import { CreateMilkDto } from './dto/create-milks.dto';

@Injectable()
export class MilksService {
  constructor(
    @InjectRepository(Milks) private milksRepository: Repository<Milks>,
  ) {}
  async findAll(): Promise<Milks[]> {
    try {
      const result = await this.milksRepository.find(
       );
      if (result.length === 0) {
        throw new NotFoundException('Milks not found');
      }
      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed fetching milks');
    }
  }
  async findOne(id: number): Promise<Milks | null> {
    try {
      return await this.milksRepository.findOne({
        where: { id },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Failed to retrieve milk with ID ${id}`,
      );
    }
  }
  async createMilk(createMilk: CreateMilkDto): Promise<Milks> {
    try {
      const newMilk = this.milksRepository.create(createMilk);
      if (!newMilk) {
        throw new BadRequestException('Couldnt create new Milk');
      }
      return this.milksRepository.save(newMilk);
    } catch (error) {
      console.error(error);
      if (error.code === '23505') {
        throw new ConflictException(`Milk with name ${createMilk.name}`);
      }
      throw new InternalServerErrorException(
        `Unexpected error at creating new milk ${createMilk.name}`,
      );
    }
  }
  async updateMilk(
    id: number,
    updateMilk: CreateMilkDto,
  ): Promise<Milks | null> {
    try {
      const result = await this.milksRepository.update(id, updateMilk);
      if (result.affected === 0) {
        throw new NotFoundException(`Milk with ID ${id} not found`);
      }
      return this.milksRepository.findOne({
        where: { id },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
  async deleteMilk(id: number): Promise<{ message: string }> {
    try {
      const result = await this.milksRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Couldnt delete milk with id ${id}`);
      }
      return { message: `Successfully deleted milk with ID ${id}` };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Unexpected error deleting milk');
    }
  }
}
