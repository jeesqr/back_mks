import { Test, TestingModule } from '@nestjs/testing';
import { OrderToppingsController } from './order_toppings.controller';

describe('OrderToppingsController', () => {
  let controller: OrderToppingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderToppingsController],
    }).compile();

    controller = module.get<OrderToppingsController>(OrderToppingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
