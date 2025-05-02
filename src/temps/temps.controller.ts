import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TempsService } from './temps.service';
import { Temps } from './entity/temps.entity';
import { CreateTempsDto } from './dto/create-temps.dto';

@Controller('temps')
export class TempsController {
  constructor(private tempsService: TempsService) {}
   @Get()
    async getTemps(): Promise<Temps[]> {
      return this.tempsService.findAll();
    }
  
    @Post('/create')
    async createTemp(@Body() createTempsDto: CreateTempsDto): Promise<Temps> {
      return this.tempsService.createTemps(createTempsDto);
    }
    
    @Get(':id')
    async getTemp(@Param('id', ParseIntPipe) id: number): Promise<Temps | null> {
      return this.tempsService.findOne(id);
    }
  
    @Put('update/:id')
    async updateTemp(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateTempDto: CreateTempsDto,
    ): Promise<Temps | null> {
      return this.tempsService.updateTemp(id, updateTempDto);
    }
  
    @Delete('delete/:id')
    async deleteTemp(
      @Param('id', ParseIntPipe) id: number,
    ): Promise<{ message: string }> {
      return this.tempsService.deleteTemp(id);
    }
}