import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  const mockUserRepository = {};
  const mockMailerService = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: MailerService, useValue: mockMailerService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  // it('should be create', () => {
  //   expect(controller.create({ name: 'Hung', password: '123', email: 'hung@gmail.com', isVerified: true })).toEqual({
  //     id: expect.any(Number),
  //     name: 'Hung',
  //     password: '123',
  //     email: 'hung@gmail.com',
  //     isVerified: true,
  //     code: null,
  //   });
  // });
});
