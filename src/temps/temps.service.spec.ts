import { Test, TestingModule } from '@nestjs/testing';
import { TempsService } from './temps.service';

describe('TempsService', () => {
  let service: TempsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TempsService],
    }).compile();

    service = module.get<TempsService>(TempsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
