import {   Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UploadedFile,
    UseInterceptors, } from '@nestjs/common';
import { Products } from './entity/products.entity';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-products.dto';
import { Flavours } from 'src/flavours/entity/flavours.entity';
import { Milks } from 'src/milks/entity/milks.entity';
import { Sizes } from 'src/sizes/entity/sizes.entity';
import { Temps } from 'src/temps/entity/temps.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) {}

    @Get()
    async getProducts(): Promise<Products[]> {
        return this.productsService.findAll();
    }

    @Get(':id')
    async getProduct(@Param('id', ParseIntPipe) id: number): Promise<Products | null> {
        return this.productsService.findOne(id);
    }

    @Get('type/:typeId')
    async getProductsByType(@Param('typeId', ParseIntPipe) typeId: number): Promise<Products[]> {
        return this.productsService.getProductsByType(typeId);
    }

    @Post('create')
    @UseInterceptors(
      FileInterceptor('image', {
        storage: diskStorage({
          destination: './uploads/products', // carpeta donde se guarda
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const name = file.originalname.split('.').slice(0, -1).join('.'); // nombre sin extension
            
            cb(null, `${file.fieldname}-${name}-${uniqueSuffix}${ext}`);
          },
        }),
      }),
    )
    async createProduct(
      @UploadedFile() image: Express.Multer.File,
      @Body() productNew: CreateProductDto): Promise<Products> {
        console.log('ProductNewNoIMG:',productNew);
        const imageUrl = `https://backmks-production.up.railway.app/uploads/products/${image.filename}`; //ASI PUEDO ACCEDER EN EL FRONT MAS FACIL
        // const imageUrl = `/uploads/products/${image.filename}`;
        const ProductNewData= {...productNew, image: imageUrl };
        console.log('ProductNewData:',ProductNewData);
        return await this.productsService.createProduct(ProductNewData);
      }



    
  @Put('update/:id')
  @UseInterceptors(
   FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const name = file.originalname.split('.').slice(0, -1).join('.'); 
            cb(null, `${file.fieldname}-${name}-${uniqueSuffix}${ext}`);
        },
      }),
  }),
)
async updateProduct(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateProductDto: CreateProductDto,
  @UploadedFile() image?: Express.Multer.File,
): Promise<Products | null> {
  if (image) {
    const imageUrl = `https://backmks-production.up.railway.app/uploads/products/${image.filename}`; 
    updateProductDto.image = imageUrl; // Actualiza la URL de la imagen en el DTO
  }
  console.log('updateProductDto:',updateProductDto);
  return this.productsService.updateProduct(id, updateProductDto);
}

    @Delete(':id')
    async deleteProduct(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<{ message: string }> {
        return this.productsService.deleteProduct(id);
    }

    @Get('flavours/:flavourId')
    async getProductsByFlavour(@Param('flavourId', ParseIntPipe) flavourId: number): Promise<Products[]> {
        return this.productsService.getProductsByFlavour(flavourId);
    }

    @Get('size/:sizeId')
    async getProductsBySize(@Param('sizeId', ParseIntPipe) sizeId: number): Promise<Products[]> {
        return this.productsService.getProductsBySize(sizeId);
    }

    @Get('temp/:tempId')
    async getProductsByTemp(@Param('tempId', ParseIntPipe) tempId: number): Promise<Products[]> {
        return this.productsService.getProductsByTemp(tempId);
    }
    

    @Get('allowed_flavours/:productId')
    async getAllowedFlavours(@Param('productId', ParseIntPipe) productId: number): Promise<Flavours[]> {
        return this.productsService.getProductAllowedFlavours(productId);
    }

    @Get('allowed_sizes/:productId')
    async getAllowedSizes(@Param('productId', ParseIntPipe) productId: number): Promise<Sizes[]> {
        return this.productsService.getProductAllowedSizes(productId);
    }

    @Get('allowed_milks/:productId')
    async getAllowedMilks(@Param('productId', ParseIntPipe) productId: number): Promise<Milks[]> {
        return this.productsService.getProductAllowedMilks(productId);
    }

    @Get('allowed_temps/:productId')
    async getAllowedTemps(@Param('productId', ParseIntPipe) productId: number): Promise<Temps[]> {
        return this.productsService.getProductAllowedTemps(productId);
    }

}
