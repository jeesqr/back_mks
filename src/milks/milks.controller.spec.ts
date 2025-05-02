import { Test, TestingModule } from '@nestjs/testing';
import { MilksController } from './milks.controller';

describe('MilksController', () => {
  let controller: MilksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MilksController],
    }).compile();

    controller = module.get<MilksController>(MilksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
