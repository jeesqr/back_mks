import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ToppingsService } from './toppings.service';
import { Toppings } from './entity/toppings.entity';
import { CreateToppingsDto } from './dto/create-toppings.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';


@Controller('toppings')
export class ToppingsController {
  constructor(private toppingsService: ToppingsService) {}
   @Get()
    async gettoppings(): Promise<Toppings[]> {
      return this.toppingsService.findAll();
    }


  
    @Post('create')
    @UseInterceptors(
      FileInterceptor('image', {
        storage: diskStorage({
          destination: './uploads/toppings', // carpeta donde se guarda
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const name = file.originalname.split('.').slice(0, -1).join('.'); // nombre sin extension
            
            cb(null, `${file.fieldname}-${name}-${uniqueSuffix}${ext}`);
          },
        }),
      }),
    )
    async createTopping(
      @UploadedFile() image: Express.Multer.File,
      @Body() toppingNew: CreateToppingsDto): Promise<Toppings> {
        console.log('toppingNewNoIMG:',toppingNew);
        const imageUrl = `https://backmks-production.up.railway.app/uploads/toppings/${image.filename}`; //ASI PUEDO ACCEDER EN EL FRONT MAS FACIL
        // const imageUrl = `/uploads/toppings/${image.filename}`;
        const ToppingNewData= {...toppingNew, image: imageUrl };
        console.log('ToppingNewData:',ToppingNewData);
        return await this.toppingsService.createTopping(ToppingNewData);
      }
    
    @Get(':id')
    async getTopping(@Param('id', ParseIntPipe) id: number): Promise<Toppings | null> {
      return this.toppingsService.findOne(id);
    }
    


  @Put('update/:id')
  @UseInterceptors(
   FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/toppings',
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
  @Body() updateToppingDto: CreateToppingsDto,
  @UploadedFile() image?: Express.Multer.File,
): Promise<Toppings | null> {
  if (image) {
    const imageUrl = `https://backmks-production.up.railway.app/uploads/toppings/${image.filename}`; 
    updateToppingDto.image = imageUrl; // Actualiza la URL de la imagen en el DTO
  }

  return this.toppingsService.updateTopping(id, updateToppingDto);
}

@Delete('delete/:id')
    async deleteTopping(
      @Param('id', ParseIntPipe) id: number,
    ): Promise<{ message: string }> {
      return this.toppingsService.deleteTopping(id);
    }
}
