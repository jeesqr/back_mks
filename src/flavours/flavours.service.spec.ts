import { Test, TestingModule } from '@nestjs/testing';
import { FlavoursService } from './flavours.service';

describe('FlavoursService', () => {
  let service: FlavoursService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlavoursService],
    }).compile();

    service = module.get<FlavoursService>(FlavoursService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
