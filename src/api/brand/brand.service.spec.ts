import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BrandRepository } from './brand.repository';
import { BrandService } from './brand.service';

describe('BrandService', () => {
  let service: BrandService;
  const mockBrandRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((brand) =>
      Promise.resolve({
        id: expect.any(Number),
        ...brand,
      }),
    ),
    getAll: jest.fn().mockImplementation(() => []),
    findOneByCondition: jest.fn().mockImplementation((id) =>
      Promise.resolve({
        id,
        name: expect.any(String),
        describe: expect.any(String),
      }),
    ),
    listSearch: jest.fn().mockImplementation((name) =>
      Promise.resolve([
        {
          id: expect.any(Number),
          name,
          describe: expect.any(String),
        },
      ]),
    ),
    update: jest.fn().mockImplementation((id, dto) => ({
      id,
      ...dto,
    })),
    delete: jest.fn().mockImplementation((id) => id),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrandService, { provide: BrandRepository, useValue: mockBrandRepository }],
    }).compile();

    service = module.get<BrandService>(BrandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  // create
  describe('create', () => {
    // create
    it('should create a new brand and return it', async () => {
      expect(await service.create({ name: 'Brand', describe: 'Description' })).toEqual({
        id: expect.any(Number),
        name: 'Brand',
        describe: 'Description',
      });
    });
    // throw exception
    it('should throw an exception when brand existed', async () => {
      mockBrandRepository.create.mockImplementation(() => false);
      expect(service.create({ name: 'Brand', describe: 'Description' })).rejects.toThrowError(BadRequestException);
    });
  });

  //  get
  describe('get', () => {
    const brand = [
      {
        id: 1,
        name: 'Hung',
        describe: 'dep trai',
      },
      {
        id: 2,
        name: 'Chuong',
        describe: 'xau trai',
      },
    ];
    it('should return all Brand', async () => {
      mockBrandRepository.getAll.mockImplementation(() => brand);
      expect(await service.getAllBrand()).toEqual(brand);
    });
    it('should return a brand', async () => {
      expect(await service.findOne(brand[0].id)).toEqual({
        id: 1,
        name: 'Hung',
        describe: 'dep trai',
      });
    });
    it('should throw an exception when not found ', async () => {
      mockBrandRepository.findOneByCondition.mockImplementation(() => false);
      expect(service.findOne(1)).rejects.toThrowError(BadRequestException);
    });
    it('should list all brand you want to list', async () => {
      expect(await service.listSearch(brand[1].name)).toEqual([
        {
          id: 2,
          name: 'Chuong',
          describe: 'xau trai',
        },
      ]);
    });
  });
  // update
  describe('update', () => {
    const brand = [
      {
        id: 1,
        name: 'Hung',
        describe: 'dep trai',
      },
      {
        id: 2,
        name: 'Chuong',
        describe: 'xau trai',
      },
    ];
    it('should update a brand with the id', async () => {
      mockBrandRepository.findOneByCondition.mockImplementation(() => true);
      expect(await service.update(brand[0].id, { ...brand[0], name: 'Hung', describe: 'Rat dep trai' })).toEqual({
        id: 1,
        name: 'Hung',
        describe: 'Rat dep trai',
      });
    });
    it('should throw an exception', async () => {
      mockBrandRepository.findOneByCondition.mockImplementation(() => false);
      expect(service.update(brand[0].id, { ...brand[0], name: 'Hung', describe: 'Rat dep trai' })).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
  describe('remove', () => {
    const brand = [
      {
        id: 1,
        name: 'Hung',
        describe: 'dep trai',
      },
      {
        id: 2,
        name: 'Chuong',
        describe: 'xau trai',
      },
    ];
    it('should remove a brand', async () => {
      mockBrandRepository.findOneByCondition.mockImplementation(() => true);
      expect(await service.remove(brand[0].id)).toEqual('Success!');
    });
    it('should throw an exception', async () => {
      mockBrandRepository.findOneByCondition.mockImplementation(() => false);
      expect(service.remove(brand[0].id)).rejects.toThrowError(BadRequestException);
    });
  });
});
