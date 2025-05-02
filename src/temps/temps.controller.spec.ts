import { Test, TestingModule } from '@nestjs/testing';
import { TempsController } from './temps.controller';

describe('TempsController', () => {
  let controller: TempsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TempsController],
    }).compile();

    controller = module.get<TempsController>(TempsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
