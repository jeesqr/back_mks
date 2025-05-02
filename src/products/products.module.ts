import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entity/products.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Milks } from 'src/milks/entity/milks.entity';
import { Toppings } from 'src/toppings/entity/toppings.entity';
import { Temps } from 'src/temps/entity/temps.entity';
import { Sizes } from 'src/sizes/entity/sizes.entity';
import { Flavours } from 'src/flavours/entity/flavours.entity';
import { Product_Type } from 'src/product_types/entity/product_types.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Products,
      Product_Type, // Asegúrate de que está aquí
      Flavours,
      Sizes,
      Temps,
      Toppings,
      Milks,
    ]),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
