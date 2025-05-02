import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Toppings } from './entity/toppings.entity';
import { Repository } from 'typeorm';
import { CreateToppingsDto } from './dto/create-toppings.dto';

@Injectable()
export class ToppingsService {
    constructor(
        @InjectRepository(Toppings) private toppingsRepository: Repository<Toppings>,
    ){}
    async findAll():Promise<Toppings[]> {
        try {
            const result = await this.toppingsRepository.find();
            if (result.length === 0) {
                throw new NotFoundException('Toppings not founded');
            }
            return result;
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error fetching toppings');
        }
    }

    async findOne(id: number): Promise<Toppings | null> {
        try {
            return await this.toppingsRepository.findOne({
                where: { id },
            });
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException(
                `Failed to retrieve Topping with ID ${id}`,
            );
        }
    }

    async createTopping(createTopping: CreateToppingsDto): Promise<Toppings> {
     try {
           const newTopping = this.toppingsRepository.create(createTopping);
           console.log('newTopping:', newTopping);
           if (!newTopping) {
             throw new BadRequestException('Couldnt create new topping');
           }
           return this.toppingsRepository.save(newTopping);
         } catch (error) {
           console.error(error);
           if (error.code === '23505') {
             throw new ConflictException(`Topping with name ${createTopping.name}`);
           }
           throw new InternalServerErrorException(
             `Unexpected error at creating new topping ${createTopping.name}`,
           );
         }
       }
    
    //Pendiente update y delete toppings

      async updateTopping(
        id: number,
        updateTopping: CreateToppingsDto,
      ): Promise<Toppings | null> {
        try {
          const result = await this.toppingsRepository.update(id, updateTopping);
          if (result.affected === 0) {
            throw new NotFoundException(`Topping with ID ${id} not found`);
          }
          return this.toppingsRepository.findOne({
            where: { id },
          });
        } catch (error) {
          console.error(error);
          throw new InternalServerErrorException();
        }
      }

      async deleteTopping(id: number): Promise<{ message: string }> {
        try {
          const result = await this.toppingsRepository.delete(id);
          if (result.affected === 0) {
            throw new NotFoundException(`Couldnt delete topping with id ${id}`);
          }
          return { message: 'Successfully deleted Topping' };
        } catch (error) {
          console.error(error);
          throw new InternalServerErrorException('Unexpected error deleting Topping');
        }
      }
}
