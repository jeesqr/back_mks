import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sizes } from './entity/sizes.entity';
import { SizesService } from './sizes.service';
import { SizesController } from './sizes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sizes])],
  providers: [SizesService],
  controllers: [SizesController],
})
export class SizesModule {}
