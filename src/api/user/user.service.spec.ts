import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  const mockUserRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((user) =>
      Promise.resolve({
        id: expect.any(Number),
        ...user,
        code: expect.any(String),
        expriseIn: expect.any(String),
        isVerified: expect.any(Boolean),
      }),
    ),
    getAll: jest.fn().mockImplementation(() => []),
    findOneByCondition: jest.fn().mockImplementation((id) =>
      Promise.resolve({
        id,
        code: expect.any(String),
        expriseIn: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        password: expect.any(String),
        isVerified: expect.any(Boolean),
      }),
    ),
    listSearch: jest.fn().mockImplementation((name) =>
      Promise.resolve([
        {
          id: expect.any(Number),
          code: expect.any(String),
          expriseIn: expect.any(String),
          name,
          email: expect.any(String),
          password: expect.any(String),
          isVerified: expect.any(Boolean),
        },
      ]),
    ),
    update: jest.fn().mockImplementation((id, dto) => ({
      id,
      ...dto,
    })),
    delete: jest.fn().mockImplementation((id) => id),
    hashPassword: jest.spyOn(bcrypt, 'hash').mockImplementation((password) => password),
  };
  const mockMailerService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: MailerService, useValue: mockMailerService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  // create user
  describe('createUser', () => {
    // create
    it('should create a new User and return it', async () => {
      expect(
        await service.createUser({ name: 'Hung', email: 'Hungboxi@gmail.com', password: '123456', isVerified: true }),
      ).toEqual({
        id: expect.any(Number),
        code: expect.any(String),
        expriseIn: expect.any(String),
        name: 'Hung',
        email: 'Hungboxi@gmail.com',
        password: '123456',
        isVerified: false,
      });
    });
    // throw exception
    // it('should throw an exception when User existed', async () => {
    //   mockUserRepository.create.mockImplementation(() => false);
    //   expect(
    //     service.createUser({ name: 'Hung', email: 'Hungboxi@gmail.com', password: '123456', isVerified: true }),
    //   ).rejects.toThrowError(BadRequestException);
    // });
  });

  //get;
  describe('get', () => {
    const user = [
      {
        id: 1,
        code: '123',
        expriseIn: '123',
        name: 'Hung',
        email: 'Hungboxi@gmail.com',
        password: '123456',
        isVerified: true,
      },
      {
        id: 2,
        code: '456',
        expriseIn: '456',
        name: 'Chuong',
        email: 'Chuong@gmail.com',
        password: '123456',
        isVerified: true,
      },
    ];
    it('should return all User', async () => {
      mockUserRepository.getAll.mockImplementation(() => user);
      expect(await service.getAllUser()).toEqual(user);
    });
    it('should return a User', async () => {
      //   mockUserRepository.findOneByCondition.mockImplementation(() => true);
      expect(await service.getOneUser(user[0].id)).toEqual({
        id: 1,
        code: '123',
        expriseIn: '123',
        name: 'Hung',
        email: 'Hungboxi@gmail.com',
        password: '123456',
        isVerified: true,
      });
    });
    it('should throw an exception when not found ', async () => {
      mockUserRepository.findOneByCondition.mockImplementation(() => false);
      expect(service.getOneUser(user[0].id)).rejects.toThrowError(BadRequestException);
    });
    it('should list all User you want to list', async () => {
      expect(await service.listSearch(user[1].name)).toEqual([
        {
          id: 2,
          code: '456',
          expriseIn: '456',
          name: 'Chuong',
          email: 'Chuong@gmail.com',
          password: '123456',
          isVerified: true,
        },
      ]);
    });
  });
  // update
  describe('update', () => {
    const user = [
      {
        id: 1,
        code: '123',
        expriseIn: '123',
        name: 'Hung',
        email: 'Hungboxi@gmail.com',
        password: '123456',
        isVerified: true,
      },
      {
        id: 2,
        code: '456',
        expriseIn: '456',
        name: 'Chuong',
        email: 'Chuong@gmail.com',
        password: '123456',
        isVerified: true,
      },
    ];
    it('should update a User with the id', async () => {
      mockUserRepository.findOneByCondition.mockImplementation(() => true);
      expect(
        await service.updateByUserId(user[0].id, {
          ...user[0],
          name: 'Hung dep trai',
          password: 'ngocanh123',
        }),
      ).toEqual({
        id: 1,
        code: '123',
        expriseIn: '123',
        name: 'Hung dep trai',
        email: 'Hungboxi@gmail.com',
        password: 'ngocanh123',
        isVerified: true,
      });
    });
    it('should throw an exception', async () => {
      mockUserRepository.findOneByCondition.mockImplementation(() => false);
      expect(
        service.updateByUserId(user[0].id, {
          ...user[0],
          name: 'Hung dep trai',
          password: 'ngocanh123',
        }),
      ).rejects.toThrowError(BadRequestException);
    });
  });
  describe('remove', () => {
    const user = [
      {
        id: 1,
        code: '123',
        expriseIn: '123',
        name: 'Hung',
        email: 'Hungboxi@gmail.com',
        password: '123456',
        isVerified: true,
      },
      {
        id: 2,
        code: '456',
        expriseIn: '456',
        name: 'Chuong',
        email: 'Chuong@gmail.com',
        password: '123456',
        isVerified: true,
      },
    ];
    it('should remove a User and create a Success message', async () => {
      mockUserRepository.findOneByCondition.mockImplementation(() => true);
      expect(await service.deleteUser(user[0].id)).toEqual('Success!');
    });
    it('should throw an exception', async () => {
      mockUserRepository.findOneByCondition.mockImplementation(() => false);
      expect(service.deleteUser(user[0].id)).rejects.toThrowError(BadRequestException);
    });
  });
});
