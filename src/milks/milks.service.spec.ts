import { Test, TestingModule } from '@nestjs/testing';
import { MilksService } from './milks.service';

describe('MilksService', () => {
  let service: MilksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MilksService],
    }).compile();

    service = module.get<MilksService>(MilksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
