import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Sizes } from './entity/sizes.entity';
import { SizesService } from './sizes.service';
import { CreateSizeDto } from './dto/create-sizes.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('sizes')
export class SizesController {
  constructor(private sizesService: SizesService) {}

  @Get()
  async getSizes(): Promise<Sizes[]> {
    return this.sizesService.findAll();
  }

  @Post('create')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/sizes', // carpeta donde se guarda
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const name = file.originalname.split('.').slice(0, -1).join('.'); // nombre sin extension
          
          cb(null, `${file.fieldname}-${name}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async createSize(
    @UploadedFile() image: Express.Multer.File,
    @Body() sizeNew: CreateSizeDto): Promise<Sizes> {
      console.log('SizeNewNoIMG:',sizeNew);
      const imageUrl = `https://backmks-production.up.railway.app/uploads/sizes/${image.filename}`; //ASI PUEDO ACCEDER EN EL FRONT MAS FACIL
      // const imageUrl = `/uploads/sizes/${image.filename}`;
      const SizeNewData= {...sizeNew, image: imageUrl };
      console.log('SizeNewData:',SizeNewData);
      return await this.sizesService.createSize(SizeNewData);
    }
  
  @Get(':id')
  async getSize(@Param('id', ParseIntPipe) id: number): Promise<Sizes | null> {
    return this.sizesService.findOne(id);
  }

 
   @Put('update/:id')
   @UseInterceptors(
    FileInterceptor('image', {
       storage: diskStorage({
         destination: './uploads/sizes',
         filename: (req, file, cb) => {
           const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
             const ext = extname(file.originalname);
             const name = file.originalname.split('.').slice(0, -1).join('.'); 
             cb(null, `${file.fieldname}-${name}-${uniqueSuffix}${ext}`);
         },
       }),
   }),
 )
 async updateSize(
   @Param('id', ParseIntPipe) id: number,
   @Body() updateSize: CreateSizeDto,
   @UploadedFile() image?: Express.Multer.File,
 ): Promise<Sizes | null> {
   if (image) {
     const imageUrl = `https://backmks-production.up.railway.app/uploads/sizes/${image.filename}`; 
     updateSize.image = imageUrl; // Actualiza la URL de la imagen en el DTO
   }
 
   return this.sizesService.updateSize(id, updateSize);
 }

  @Delete('delete/:id')
  async deleteSize(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.sizesService.deleteSize(id);
  }
}
