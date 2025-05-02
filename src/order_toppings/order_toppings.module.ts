import { Module } from '@nestjs/common';
import { OrderToppingsService } from './order_toppings.service';
import { OrderToppingsController } from './order_toppings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [OrderToppingsService],
  controllers: [OrderToppingsController],
  imports: [TypeOrmModule.forFeature([])],
})
export class OrderToppingsModule {}
