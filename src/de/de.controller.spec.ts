import { Test, TestingModule } from '@nestjs/testing';
import { DeController } from './de.controller';
import { DeService } from './de.service';

describe('DeController', () => {
  let controller: DeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeController],
      providers: [DeService],
    }).compile();

    controller = module.get<DeController>(DeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
