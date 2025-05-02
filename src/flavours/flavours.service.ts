import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Flavours } from './entity/flavours.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFlavourDto } from './dto/create-flavour.dto';

@Injectable()
export class FlavoursService {
  constructor(
    @InjectRepository(Flavours)
    private FlavoursRepository: Repository<Flavours>,
  ) {}

  async createFlavour(createFlavourDto:CreateFlavourDto){
    const newflavour=this.FlavoursRepository.create(createFlavourDto);
    try {
      return await this.FlavoursRepository.save(newflavour);   
    } catch (error) {
      console.error('Error al crear :', error);
      throw new HttpException('No se pudo crear el sabor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateFlavour(id:number, updateFlavourDto:CreateFlavourDto){
    try {
      await this.FlavoursRepository.update(id, updateFlavourDto);
      return await this.FlavoursRepository.findOne({ where: { id } });
    } catch (error) {
      console.error('Error al actualizar el id:', error);
      throw new HttpException('No se pudo actualizar el sabor', HttpStatus.INTERNAL_SERVER_ERROR);
    }    
  }
  

  async deleteFlavour(id:number){
    try {
      await this.FlavoursRepository.softDelete(id);
    } catch (error) {
      console.error('Error al eliminar el id:', error);
      throw new HttpException('No se pudo eliminar el sabor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async findAll(): Promise<Flavours[]> {
    try {
      return await this.FlavoursRepository.find();
    } catch (error) {
      console.error('Error fetching Flavours', error);
      throw new HttpException('Couldn`t find flavours', HttpStatus.BAD_REQUEST);
    }
  }
 async findOne(id: number): Promise<Flavours | null> {
    try {
      return await this.FlavoursRepository.findOne({
        where: { id },
       
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Failed to retrieve flavor with ID ${id}`,
      );
    }
  }
}
