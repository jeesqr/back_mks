import { Test, TestingModule } from '@nestjs/testing';
import { FlavoursController } from './flavours.controller';

describe('FlavoursController', () => {
  let controller: FlavoursController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlavoursController],
    }).compile();

    controller = module.get<FlavoursController>(FlavoursController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
