import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Temps } from './entity/temps.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTempsDto } from './dto/create-temps.dto';

@Injectable()
export class TempsService {
    constructor(
        @InjectRepository(Temps) private TempsRepository: Repository<Temps>,
    ){}

    async findAll():Promise<Temps[]> {
        try {
            const result = await this.TempsRepository.find();
            if (result.length === 0) {
                throw new NotFoundException('Temps not founded');
            }
            return result;
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error fetching Temps');
        }
    }

    async findOne(id: number): Promise<Temps | null> {
        try {
            return await this.TempsRepository.findOne({
                where: { id },
            });
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                `Failed to retrieve Temp with ID ${id}`,
            );
        }
    }

    async createTemps(createTemp: CreateTempsDto): Promise<Temps> {
     try {
           const newTemp = this.TempsRepository.create(createTemp);
           if (!newTemp) {
             throw new BadRequestException('Couldnt create new Temp');
           }
           return this.TempsRepository.save(newTemp);
           
         } catch (error) {
           console.error(error);
           if (error.code === '23505') {
             throw new ConflictException(`Temp with name ${createTemp.name}`);
           }
           throw new InternalServerErrorException(
             `Unexpected error at creating new Temp ${createTemp.name}`,
           );
         }
       }
    
    //Pendiente update y delete Temps

      async updateTemp(
        id: number,
        updateTemp: CreateTempsDto,
      ): Promise<Temps | null> {
        try {
          const result = await this.TempsRepository.update(id, updateTemp);
          if (result.affected === 0) {
            throw new NotFoundException(`Temp with ID ${id} not found`);
          }
          return this.TempsRepository.findOne({
            where: { id },
          });
        } catch (error) {
          console.error(error);
          throw new InternalServerErrorException();
        }
      }

      async deleteTemp(id: number): Promise<{ message: string }> {
        try {
          const result = await this.TempsRepository.delete(id);
          if (result.affected === 0) {
            throw new NotFoundException(`Couldnt delete Temp with id ${id}`);
          }
          return { message: 'Successfully deleted Temp' };
        } catch (error) {
          console.error(error);
          throw new InternalServerErrorException('Unexpected error deleting Temp');
        }
      }
}