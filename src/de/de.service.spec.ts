import { Test, TestingModule } from '@nestjs/testing';
import { DeService } from './de.service';

describe('DeService', () => {
  let service: DeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeService],
    }).compile();

    service = module.get<DeService>(DeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
