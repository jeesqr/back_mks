import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Product_Type } from './entity/product_types.entity';
import { ProductTypesService } from './product_types.service';
import { CreateProductTypeDto } from './dto/create-product_types.dto';

@Controller('product_types')
export class ProductTypesController {
  constructor(private prodcutTypesService: ProductTypesService) {}
  @Get()
  async getProductTypes(): Promise<Product_Type[]> {
    return this.prodcutTypesService.findAll();
  }

  @Post('create')
  async createProductType(
    @Body() createproduct_typesDto: CreateProductTypeDto,
  ): Promise<Product_Type> {
    return this.prodcutTypesService.createProductType(createproduct_typesDto);
  }

  @Get(':id')
  async getProductType(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Product_Type | null> {
    return this.prodcutTypesService.findOne(id);
  }

  @Put('update/:id')
  async updateProductType(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProduct_typesDto: CreateProductTypeDto,
  ): Promise<Product_Type | null> {
    return this.prodcutTypesService.updateProductType(
      id,
      updateProduct_typesDto,
    );
  }

  @Delete('delete/:id')
  async deleteProductType(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.prodcutTypesService.deleteProductType(id);
  }
}
