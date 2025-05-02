import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FlavoursService } from './flavours.service';
import { CreateFlavourDto } from './dto/create-flavour.dto';
import { Flavours } from './entity/flavours.entity';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('flavours')
export class FlavoursController {
  constructor(private flavourService: FlavoursService) {}

  @Get()
  async findAllFlavours() {
    try {
      const flavours = await this.flavourService.findAll();
      if (!flavours || flavours.length === 0) {
        throw new HttpException('No flavours found', HttpStatus.NOT_FOUND);
      }
      return  flavours;
    } catch (error) {
      console.error('Error fetching Flavours', error);
      if (error instanceof HttpException) {
        throw error; // Re-throw custom HttpException
      }
      throw new HttpException(
        'Couldn`t find flavours',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findFlavourById(@Param('id', ParseIntPipe) id: number) {
    try {
      const flavour = await this.flavourService.findOne(id);
      if (!flavour) {
        throw new HttpException('Flavour not found', HttpStatus.NOT_FOUND);
      }
      return { flavour };
    } catch (error) {
      console.error('Error fetching flavour by ID:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Couldn`t find flavour',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

   @Post('create')
      @UseInterceptors(
        FileInterceptor('image', {
          storage: diskStorage({
            destination: './uploads/flavors', // carpeta donde se guarda
            filename: (req, file, cb) => {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
              const ext = extname(file.originalname);
              const name = file.originalname.split('.').slice(0, -1).join('.'); 
              
              cb(null, `${file.fieldname}-${name}-${uniqueSuffix}${ext}`);
            },
          }),
        }),
      )
      async createTopping(
        @UploadedFile() image: Express.Multer.File,
        @Body() flavorNew: CreateFlavourDto): Promise<Flavours> {
          const imageUrl = `https://backmks-production.up.railway.app/uploads/flavors/${image.filename}`; 
          // const imageUrl = `/uploads/toppings/${image.filename}`;
          const FlavorNewData= {...flavorNew, image: imageUrl };
          console.log('flavorNewData:',FlavorNewData);
          return await this.flavourService.createFlavour(FlavorNewData);
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
    @Body() updateFlavor: CreateFlavourDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<Flavours | null> {
    if (image) {
      const imageUrl = `https://backmks-production.up.railway.app/uploads/flavors/${image.filename}`; 
      updateFlavor.image = imageUrl; // Actualiza la URL de la imagen en el DTO
    }
  
    return this.flavourService.updateFlavour(id, updateFlavor);
  }


  @Delete('delete/:id')
  async deleteFlavour(@Param('id', ParseIntPipe) id: number) {
    try {
      const deletedFlavour = await this.flavourService.deleteFlavour(id);
      // if (!deletedFlavour) {
      //   throw new HttpException('Flavour not found or couldn\'t delete', HttpStatus.NOT_FOUND);
      // }
      return { message: 'Flavour deleted successfully' };
    } catch (error) {
      console.error('Error deleting flavour:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Couldn’t delete flavour',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
