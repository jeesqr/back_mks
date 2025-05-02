import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tickets } from './entity/tickets.entity';
import { Orders } from 'src/orders/entity/orders.entity';
import { User } from 'src/users/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tickets, Orders, User])],
  providers: [TicketsService],
  controllers: [TicketsController],
})
export class TicketsModule {}
