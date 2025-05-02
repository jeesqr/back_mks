import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entity/products.entity';
import { In, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-products.dto';
import { Product_Type } from 'src/product_types/entity/product_types.entity';
import { Flavours } from 'src/flavours/entity/flavours.entity';
import { Sizes } from 'src/sizes/entity/sizes.entity';
import { Temps } from 'src/temps/entity/temps.entity';
import { Toppings } from 'src/toppings/entity/toppings.entity';
import { Milks } from 'src/milks/entity/milks.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Products) private productsRepository: Repository<Products>,
        @InjectRepository(Product_Type) private readonly productTypeRepository: Repository<Product_Type>,
        @InjectRepository(Flavours) private readonly flavoursRepository: Repository<Flavours>,
        @InjectRepository(Sizes) private readonly sizesRepository: Repository<Sizes>,
        @InjectRepository(Temps) private readonly tempsRepository: Repository<Temps>,
        @InjectRepository(Toppings) private readonly toppingsRepository: Repository<Toppings>,
        @InjectRepository(Milks) private readonly milksRepository: Repository<Milks>,

    ) {}
    async findAll(): Promise<Products[]>{
        try{
            const result = await this.productsRepository.find(
                {relations: ['flavours', 'sizes', 'temp', 'toppings', 'milks', 'type']}
            );
            if(result.length === 0){
                throw new NotFoundException('Products not found');
            }
            return result;
        }catch(error){
            throw new InternalServerErrorException('Unexpected error fetching products');
        }
    }

    async findOne(id: number): Promise<Products | null>{
        try{
            const result= await this.productsRepository.findOne({
                where: {id},
                relations: ['flavours', 'sizes', 'temp', 'toppings', 'milks', 'type']
            });
            if(!result){
                throw new NotFoundException(`Product with ID ${id} not found`);
            }
            return result;

        }catch(error){
            console.error(error);
            throw new InternalServerErrorException(
                `Failed to retrieve Product with ID ${id}`,
            );
        }
    }

    async getProductsByType(typeId: number): Promise<Products[]> {
        return await this.productsRepository.find({
          where: { type: { id: typeId } },
          relations: ['type', 'flavours', 'sizes', 'temp', 'toppings', 'milks'],
        });
      }

      async createProduct(createProduct: CreateProductDto): Promise<Products> {
        try {
          const {
            name,
            base_price,
            type,
            image,
            flavours,
            sizes,
            temp,
            toppings,
            milks,
          } = createProduct;
      
          // Buscar entidades relacionadas
          const typeEntity = await this.productTypeRepository.findOne({ where: { id: type } });
          if (!typeEntity) throw new BadRequestException('Invalid product type');

          const flavoursEntities = await this.flavoursRepository.findBy({ id: In(flavours) });
          const sizesEntities = await this.sizesRepository.findBy({ id: In(sizes) });
          const tempsEntities = await this.tempsRepository.findBy({ id: In(temp) });
          const toppingsEntities = await this.toppingsRepository.findBy({ id: In(toppings) });
          const milksEntities = await this.milksRepository.findBy({ id: In(milks) });
      
          // Crear instancia del producto
          const newProduct = this.productsRepository.create({
            name,
            base_price,
            image,
            type: typeEntity,
            flavours: flavoursEntities,
            sizes: sizesEntities,
            temp: tempsEntities,
            toppings: toppingsEntities,
            milks: milksEntities,
          });
      
          
          return await this.productsRepository.save(newProduct);
        } catch (error) {
          throw new BadRequestException('Error creating product', error.message);
        }
      }


    async updateProduct(id: number, updateProduct: CreateProductDto): Promise<Products | null> {
        try {
        const {
            name,
            base_price,
            type,
            image,
            flavours,
            sizes,
            temp,
            toppings,
            milks,
        } = updateProduct;
        console.log('bandera 1',);
        // Buscar entidades relacionadas
        const typeEntity = await this.productTypeRepository.findOne({ where: { id: type } });
        if (!typeEntity) throw new BadRequestException('Invalid product type');
    
        const flavoursEntities = await this.flavoursRepository.findBy({ id: In(flavours) });
        const sizesEntities = await this.sizesRepository.findBy({ id: In(sizes) });
        const tempsEntities = await this.tempsRepository.findBy({ id: In(temp) });
        const toppingsEntities = await this.toppingsRepository.findBy({ id: In(toppings) });
        const milksEntities = await this.milksRepository.findBy({ id: In(milks) });
       
        // Actualizar instancia del producto
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ['flavours', 'sizes', 'temp', 'toppings', 'milks', 'type'],
          });
          
          if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
          }
          
          product.name = name;
          product.base_price = base_price;
          product.image = image;
          product.type = typeEntity;
          product.flavours = flavoursEntities;
          product.sizes = sizesEntities;
          product.temp = tempsEntities;
          product.toppings = toppingsEntities;
          product.milks = milksEntities;
          
          await this.productsRepository.save(product);
    
        console.log('updated product:',product);
        return await this.productsRepository.findOne({
            where: { id },
            relations: ['flavours', 'sizes', 'temp', 'toppings', 'milks', 'type'],
        });
        } catch (error) {
        throw new BadRequestException('Error updating product', error.message);
        }
    }

    async deleteProduct(id: number): Promise<{ message: string }> {
        try {
          const result = await this.productsRepository.delete(id);
          if (result.affected === 0) {
            throw new NotFoundException(`Couldnt delete Product with id ${id}`);
          }
          return { message: 'Successfully deleted Product' };
        } catch (error) {
          console.error(error);
          throw new InternalServerErrorException('Unexpected error deleting Product');
        }
      }

    async getProductsByFlavour(flavourId: number): Promise<Products[]> {
        try{
            const find=await this.productsRepository.createQueryBuilder('products')
            .leftJoinAndSelect('products.flavours', 'flavours')
            .where('flavours.id = :flavourId', {flavourId})
            .getMany();
            if(find.length === 0){
                throw new NotFoundException(`Products with flavor id ${flavourId} not found`);
            }
            return find;
        }catch(error){
            throw new InternalServerErrorException('Unexpected error fetching products');
        }
    }

    async getProductsBySize(sizeId: number): Promise<Products[]> {
        try{
            const find=await this.productsRepository.createQueryBuilder('products')
            .leftJoinAndSelect('products.sizes', 'sizes')
            .where('sizes.id = :sizeId', {sizeId})
            .getMany();
            if(find.length === 0){
                throw new NotFoundException(`Products with size id ${sizeId} not found`);
            }
            return find;
        }catch(error){
            throw new InternalServerErrorException('Unexpected error fetching products');
        }
    }

    async getProductsByTemp(tempId: number): Promise<Products[]> {
        try{
            const find=await this.productsRepository.createQueryBuilder('products')
            .leftJoinAndSelect('products.temp', 'temp')
            .where('temp.id = :tempId', {tempId})
            .getMany();
            if(find.length === 0){
                throw new NotFoundException(`Products with temp id ${tempId} not found`);
            }
            return find;
        }catch(error){
            throw new InternalServerErrorException('Unexpected error fetching products');
        }
    }

    async getProductAllowedToppings(productId: number): Promise<Toppings[]> {
        try {
            const product = await this.productsRepository.findOne({
                where: { id: productId },
                relations: ['toppings'],
            });
            if (!product) {
                throw new NotFoundException(`Product with ID ${productId} not found`);
            }
            return product.toppings;
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error fetching product toppings');
        }
    }
    async getProductAllowedMilks(productId: number): Promise<Milks[]> {
        try {
            const product = await this.productsRepository.findOne({
                where: { id: productId },
                relations: ['milks'],
            });
            if (!product) {
                throw new NotFoundException(`Product with ID ${productId} not found`);
            }
            return product.milks;
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error fetching product milks');
        }
    }
    async getProductAllowedSizes(productId: number): Promise<Sizes[]> {
        try {
            const product = await this.productsRepository.findOne({
                where: { id: productId },
                relations: ['sizes'],
            });
            if (!product) {
                throw new NotFoundException(`Product with ID ${productId} not found`);
            }
            return product.sizes;
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error fetching product sizes');
        }
    }
    async getProductAllowedFlavours(productId: number): Promise<Flavours[]> {
        try {
            const product = await this.productsRepository.findOne({
                where: { id: productId },
                relations: ['flavours'],
            });
            if (!product) {
                throw new NotFoundException(`Product with ID ${productId} not found`);
            }
            return product.flavours;
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error fetching product flavours');
        }
    }
    async getProductAllowedTemps(productId: number): Promise<Temps[]> {
        try {
            const product = await this.productsRepository.findOne({
                where: { id: productId },
                relations: ['temp'],
            });
            if (!product) {
                throw new NotFoundException(`Product with ID ${productId} not found`);
            }
            return product.temp;
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error fetching product temps');
        }
    }

    
    

      
}


