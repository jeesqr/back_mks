import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from './entity/orders.entity';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-orders.dto';
import { Flavours } from 'src/flavours/entity/flavours.entity';
import { Milks } from 'src/milks/entity/milks.entity';
import { Products } from 'src/products/entity/products.entity';
import { Sizes } from 'src/sizes/entity/sizes.entity';
import { Temps } from 'src/temps/entity/temps.entity';
import { Tickets, TicketStatus } from 'src/tickets/entity/tickets.entity';
import { Toppings } from 'src/toppings/entity/toppings.entity';
import { User } from 'src/users/entity/user.entity';
import { ToppingOrderDto } from 'src/toppings/dto/create-toppings-orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}
  async findAll(): Promise<Orders[]> {
    try {
      const result = await this.ordersRepository.find({
        relations: [
          'product',
          'toppings',
          'ticket',
          'flavour',
          'size',
          'milk',
          'temp',
        ],
      });
      if (result.length === 0) {
        throw new NotFoundException('Orders not found');
      }
      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Unexpected error fetching Orders',
      );
    }
  }
  async findOne(id: number): Promise<Orders | null> {
    try {
      const result = await this.ordersRepository.findOne({
        where: { id },
        relations: [
          'product',
          'toppings',
          'ticket',
          'flavour',
          'size',
          'milk',
          'temp',
        ],
      });
      if (!result) {
        throw new NotFoundException(`Order with ID: ${id} not found`);
      }
      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Unexpected error retrieving order with ID: ${id}`,
      );
    }
  }
  async createOrder(
    order: CreateOrderDto,
    ticket: Tickets,
    transactionalEntityManager: EntityManager,
  ): Promise<Orders> {
    try {
      const toppingsId = order.toppings.map((topping) => topping.id);
      const [product, flavour, size, temp, milk, toppings] = await Promise.all([
        transactionalEntityManager.findOne(Products, {
          where: { id: order.productId },
        }),
        transactionalEntityManager.findOne(Flavours, {
          where: { id: order.flavoursId },
        }),
        transactionalEntityManager.findOne(Sizes, {
          where: { id: order.sizesId },
        }),
        transactionalEntityManager.findOne(Temps, {
          where: { id: order.tempId },
        }),
        transactionalEntityManager.findOne(Milks, {
          where: { id: order.milksId },
        }),
        transactionalEntityManager.find(Toppings, {
          where: { id: In(toppingsId) },
        }),
      ]);
      if (
        !product ||
        !flavour ||
        !size ||
        !temp ||
        !milk ||
        toppings.length !== order.toppings.length
      ) {
        const missingEntities: string[] = [];
        if (!product)
          missingEntities.push(`Product with ID ${order.productId}`);
        if (!flavour)
          missingEntities.push(`Flavour with ID ${order.flavoursId}`);
        if (!size) missingEntities.push(`Size with ID ${order.sizesId}`);
        if (!temp) missingEntities.push(`Temperature with ID ${order.tempId}`);
        if (!milk) missingEntities.push(`Milk with ID ${order.milksId}`);
        throw new NotFoundException(
          `The following entities were not found: ${missingEntities.join(', ')}`,
        );
      }

      const toppingsPrice = this.calculateToppingsPrice(
        order.toppings,
        toppings,
      );

      const price =
        product.base_price +
        size.price +
        milk.price +
        temp.price +
        flavour.price +
        toppingsPrice;

      const newOrder = {
        product,
        flavour,
        size,
        temp,
        milk,
        toppings,
        ticket,
        price,
      };
      return await transactionalEntityManager.save(Orders, newOrder);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(`Unexpected error creating Order`);
    }
  }
  async createOrderWithTicket(
    orders: CreateOrderDto[],
  ): Promise<Tickets | null> {
    try {
      return this.dataSource.transaction(async (transactionalEntityManager) => {
        const cashier = await this.usersRepository.findOne({
          where: { id: orders[0].cashierId },
        });
        if (!cashier) {
          throw new NotFoundException(
            `Couldnt find cashier with ID: ${orders[0].cashierId} `,
          );
        }
        const ticket = new Tickets();
        ticket.ticket_date = new Date();
        ticket.cashier = cashier;
        ticket.total = 0;
        ticket.orders = [];
        ticket.payment_method = 'Efectivo';
        ticket.status = TicketStatus.PENDIENTE;

        const savedTicket = await transactionalEntityManager.save(
          Tickets,
          ticket,
        );

        for (const orderDto of orders) {
          const order = await this.createOrder(
            orderDto,
            savedTicket,
            transactionalEntityManager,
          );
          savedTicket.total += order.price;
          savedTicket.orders.push(order);
        }
        const newTicket = await transactionalEntityManager.save(
          Tickets,
          savedTicket,
        );
        console.log(newTicket);

        return transactionalEntityManager.findOne(Tickets, {
          where: { id: newTicket.id },
          relations: [
            'cashier',
            'orders',
            'orders.product',
            'orders.flavour',
            'orders.size',
            'orders.milk',
            'orders.toppings',
            'orders.temp',
          ],
        });
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Unexpected error creating Orders',
      );
    }
  }
  private calculateToppingsPrice(
    orderToppings: ToppingOrderDto[],
    dbToppings: Toppings[],
  ): number {
    const dtoToppingsMap = new Map(orderToppings.map((t) => [t.id, t]));
    let total = 0;

    for (const dbTopping of dbToppings) {
      const dtoTopping = dtoToppingsMap.get(dbTopping.id);
      if (!dtoTopping) continue;

      const chargeableQuantity = dtoTopping.quantity - dbTopping.free_quantity;
      if (chargeableQuantity > 0) {
        total += chargeableQuantity * dbTopping.price;
      }
    }

    return total;
  }

  async getOrderByTicketId(id: number) {
    try {
      const result = await this.ordersRepository.find({
        where: { ticket: { id } },
        relations: [
          'product',
          'toppings',
          'ticket',
          'flavour',
          'size',
          'milk',
          'temp',
        ],
      });
      if (result.length === 0) {
        throw new NotFoundException(`Orders not found for ticket ID: ${id}`);
      }
      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Unexpected error fetching orders for ticket ID: ${id}`,
      );
    }
  }

  async deleteOrder(id: number): Promise<{ message: string }> {
    try {
      const result = await this.ordersRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Could not delete order with ID: ${id}`);
      }

      return { message: `Order with ID: ${id} deleted succesffully.` };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Unexpected error deleting order with ID: ${id}`,
      );
    }
  }
}
