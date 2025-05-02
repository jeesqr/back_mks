import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product_Type } from './entity/product_types.entity';
import { Repository } from 'typeorm';
import { CreateProductTypeDto } from './dto/create-product_types.dto';

@Injectable()
export class ProductTypesService {
    constructor(       
    @InjectRepository(Product_Type) private Product_typesRepository: Repository<Product_Type>,
    ){}
async findAll():Promise<Product_Type[]> {
    try {
        const result = await this.Product_typesRepository.find();
        if (result.length === 0) {
            throw new NotFoundException('Product types not founded');
        }
        return result;
    } catch (error) {
        throw new InternalServerErrorException('Unexpected error fetching Product types');
    }
}

async findOne(id: number): Promise<Product_Type | null> {
    try {
        return await this.Product_typesRepository.findOne({
            where: { id },
        });
    } catch (error) {
        console.error(error);
        throw new InternalServerErrorException(
            `Failed to retrieve Product type with ID ${id}`,
        );
    }
}

async createProductType(createProductType: CreateProductTypeDto): Promise<Product_Type> {
 try {
       const newType = this.Product_typesRepository.create(createProductType);
       if (!newType) {
         throw new BadRequestException('Couldnt create new Product type');
       }
       return this.Product_typesRepository.save(newType);
     } catch (error) {
       console.error(error);
       if (error.code === '23505') {
         throw new ConflictException(`Product type with name ${createProductType.type}`);
       }
       throw new InternalServerErrorException(
         `Unexpected error at creating new Product type ${createProductType.type}`,
       );
     }
   }

//Pendiente update y delete Product_types

  async updateProductType(
    id: number,
    updateProductType: CreateProductTypeDto,
  ): Promise<Product_Type | null> {
    try {
      const result = await this.Product_typesRepository.update(id, updateProductType);
      if (result.affected === 0) {
        throw new NotFoundException(`product type with ID ${id} not found`);
      }
      return this.Product_typesRepository.findOne({
        where: { id },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteProductType(id: number): Promise<{ message: string }> {
    try {
      const result = await this.Product_typesRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Couldnt delete product type with id ${id}`);
      }
      return { message: 'Successfully deleted product type' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Unexpected error deleting product type');
    }
  }
}
