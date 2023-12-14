import {
  BadRequestException,
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ERROR } from '../../share/common/error-code.const';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuid } from 'uuid';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { hotp } from 'node-otp';
import SmsService from 'src/share/services/sms/sms.service';
import { Cache } from 'cache-manager';
import { VerifyPhoneDto } from './dto/verify-otp.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private mailService: MailerService,
    private smsService: SmsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return user[0];
  }
  async findAllPage(perPage: number, pageNumber: number) {
    return this.userRepository.getAllPageUser(perPage, pageNumber);
  }
  async updateByUserId(userId: number, updateUserDto: UpdateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(updateUserDto.password, salt);
    const userFound = await this.userRepository.findOneByCondition(userId);
    if (!userFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    const userWasUpdated = await this.userRepository.update(userFound.id, { ...updateUserDto, password: hashPassword });

    return userWasUpdated;
  }

  async createUser(data: CreateUserDto): Promise<UserEntity> {
    const checkEmail = data.email;
    const mail = await this.userRepository.findOneByCondition({ email: checkEmail });
    if (mail) {
      throw new BadRequestException(ERROR.USER_EXISTED.MESSAGE);
    }
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(data.password, salt);
    const code = uuid();
    const expriseIn = Date.now() + 3600; //1h'
    this.userRepository.create({
      ...data,
      password: hashPassword,
      code: code,
      expriseIn: String(expriseIn),
    });
    const newUser = await this.userRepository.save({
      ...data,
      password: hashPassword,
      code: code,
      expriseIn: String(expriseIn),
    });
    return newUser;
  }

  async getAllUser(): Promise<UserEntity> {
    return this.userRepository.getAll();
  }
  async getOneUser(id: number) {
    const userFound = await this.userRepository.findOneByCondition({
      where: { id: id },
      select: ['id', 'name', 'email', 'password', 'isVerified', 'role'],
    });
    if (!userFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    return userFound;
  }
  async deleteUser(id: number) {
    const userFound = await this.userRepository.findOneByCondition({
      id,
    });
    if (!userFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    await this.userRepository.delete(id);
    return 'Success!';
  }
  async listSearch(name: string) {
    return this.userRepository.listSearch(name);
  }
  async verifyEmail(code: string) {
    return this.userRepository.getUserByCode(code);
  }
  async updatePhoneNumber(id: number, phone: UpdatePhoneDto) {
    const userFound = await this.userRepository.findOneByCondition(id);
    if (!userFound) {
      throw new BadRequestException(ERROR.USER_NOT_FOUND.MESSAGE);
    }
    userFound.phoneNumber = phone.phoneNumber;
    userFound.isPhoneNumberConfirmed = true;
    return userFound.save();
  }
  async sendSms(id: number, phone: UpdatePhoneDto) {
    const { phoneNumber } = phone;
    const userFound = await this.userRepository.findOneByCondition(id);
    if (userFound.phoneNumber == phoneNumber) {
      throw new BadRequestException(ERROR.PHONE_EXISTED.MESSAGE);
    }
    const otp = hotp({
      secret: String(Math.random()),
    });
    const phoneKey = 'phoneKey:' + id;
    const otpKey = 'otpKey:' + id;
    await this.cacheManager.set(otpKey, otp, {
      ttl: +process.env.OTP_EXPIRED_IN,
    });
    await this.cacheManager.set(phoneKey, phoneNumber, {
      ttl: +process.env.PHONE_NUMBER_EXPIRED_IN,
    });
    // await this.smsService.initiatePhoneNumberVerification(phone.phoneNumber, otp);
    return new HttpException('Check your phone', HttpStatus.OK);
  }
  async verifyOtp(id: number, otp: VerifyPhoneDto) {
    const phoneKey = 'phoneKey:' + id;
    const otpKey = 'otpKey:' + id;
    const phone: string = await this.cacheManager.get(phoneKey);
    const otp1 = await this.cacheManager.get(otpKey);
    if (otp.otp !== otp1) {
      return false;
    }
    const updateUser = await this.updatePhoneNumber(id, { ...UpdatePhoneDto, phoneNumber: phone });
    await this.cacheManager.del(phoneKey);
    await this.cacheManager.del(otpKey);
    return updateUser;
  }
  async Active2StepVerify(id: number) {
    const userFound = await this.userRepository.findOneByCondition(id);
    if (userFound.isPhoneNumberConfirmed === false) {
      throw new BadRequestException(ERROR.VERIFY.MESSAGE);
    }
    if (userFound.isActive2StepVerify === false) {
      userFound.isActive2StepVerify = true;
      return userFound.save();
    }
    if (userFound.isActive2StepVerify === true) {
      userFound.isActive2StepVerify = false;
      return userFound.save();
    }
  }
}
