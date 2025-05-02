import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './entity/orders.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { User } from 'src/users/entity/user.entity';
import { Flavours } from 'src/flavours/entity/flavours.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orders, User])],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
