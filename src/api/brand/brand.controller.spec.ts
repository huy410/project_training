import { Test, TestingModule } from '@nestjs/testing';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';

describe('BrandController', () => {
  let controller: BrandController;

  //   const mockBrandService = {};
  const mockBrandService = {
    create: jest.fn((dto) => {
      return { id: expect.any(Number), ...dto };
    }),
    update: jest.fn((id, dto) => {
      return {
        id,
        ...dto,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandController],
      providers: [BrandService, { provide: BrandService, useValue: mockBrandService }],
    })
      //   .overrideProvider(UserService)
      //   .useValue(mockBrandService)
      .compile();

    controller = module.get<BrandController>(BrandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a brand', async () => {
    const dto = { name: 'Brand', describe: 'Description' };
    expect(await controller.create(dto)).toEqual({
      id: expect.any(Number),
      ...dto,
    });
    expect(mockBrandService.create).toHaveBeenCalledWith({ name: 'Brand', describe: 'Description' });
  });

  describe('update brand', () => {
    it('should update existing', async () => {
      const dto = { name: 'Brand', describe: 'Description' };
      expect(await controller.update('1', dto)).toEqual({
        id: 1,
        ...dto,
      });
    });
  });
});
