import { Test, TestingModule } from '@nestjs/testing';
import { OrderToppingsService } from './order_toppings.service';

describe('OrderToppingsService', () => {
  let service: OrderToppingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderToppingsService],
    }).compile();

    service = module.get<OrderToppingsService>(OrderToppingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
