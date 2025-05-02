import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Orders } from './entity/orders.entity';
import { CreateOrderDto } from './dto/create-orders.dto';

@Controller('orders')
export class OrdersController {
  constructor(private ordersServive: OrdersService) {}

  @Get()
  async findAll(): Promise<Orders[]> {
    return this.ordersServive.findAll();
  }

  @Post('create')
  async createOrder(@Body() orders: CreateOrderDto[]) {
    return this.ordersServive.createOrderWithTicket(orders);
  }

  @Delete('delete/:id')
  async deleteOrder(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.ordersServive.deleteOrder(id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Orders | null> {
    return this.ordersServive.findOne(id);
  }

  @Get('ticket/:id')
  async findByTicketId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Orders[]> {
    return this.ordersServive.getOrderByTicketId(id);
  }
}
