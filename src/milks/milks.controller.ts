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
import { Milks } from './entity/milks.entity';
import { MilksService } from './milks.service';
import { CreateMilkDto } from './dto/create-milks.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('milks')
export class MilksController {
  constructor(private milksService: MilksService) {}

  @Get()
  async getMilks(): Promise<Milks[]> {
    return this.milksService.findAll();
  }
     @Post('create')
     @UseInterceptors(
       FileInterceptor('image', {
         storage: diskStorage({
           destination: './uploads/milks', // carpeta donde se guarda
           filename: (req, file, cb) => {
             const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
             const ext = extname(file.originalname);
             const name = file.originalname.split('.').slice(0, -1).join('.'); // nombre sin extension
             
             cb(null, `${file.fieldname}-${name}-${uniqueSuffix}${ext}`);
           },
         }),
       }),
     )
     async createMilk(
       @UploadedFile() image: Express.Multer.File,
       @Body() milkNew: CreateMilkDto): Promise<Milks> {
         console.log('MilkNewNoIMG:',milkNew);
         const imageUrl = `https://backmks-production.up.railway.app/uploads/milks/${image.filename}`; //ASI PUEDO ACCEDER EN EL FRONT MAS FACIL
         // const imageUrl = `/uploads/milks/${image.filename}`;
         const MilkNewData= {...milkNew, image: imageUrl };
         console.log('MilkNewData:',MilkNewData);
         return await this.milksService.createMilk(MilkNewData);
       }


  @Get(':id')
  async getMilk(@Param('id', ParseIntPipe) id: number) {
    return this.milksService.findOne(id);
  }

  @Put('update/:id')
  @UseInterceptors(
   FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/milks',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const name = file.originalname.split('.').slice(0, -1).join('.'); 
            cb(null, `${file.fieldname}-${name}-${uniqueSuffix}${ext}`);
        },
      }),
  }),
)
async updateTopping(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateMilkDto: CreateMilkDto,
  @UploadedFile() image?: Express.Multer.File,
): Promise<Milks | null> {
  if (image) {
    const imageUrl = `https://backmks-production.up.railway.app/uploads/milks/${image.filename}`; 
    updateMilkDto.image = imageUrl; // Actualiza la URL de la imagen en el DTO
  }

  return this.milksService.updateMilk(id, updateMilkDto);
}


  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.milksService.deleteMilk(id);
  }
}
