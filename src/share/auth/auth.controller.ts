import {
  Body,
  CACHE_MANAGER,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOkResponse,
  ApiTags,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { CreateUserDto } from '../../api/user/dto/create-user.dto';
import { AUTH_SWAGGER_RESPONSE } from './auth.constant';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { MailerService } from '@nestjs-modules/mailer';
import { forgotPasswordDto } from './dto/forgot-password.dto';
import { Cache } from 'cache-manager';
import { GetNewTokenDto } from './dto/get-token.dto';
import { Login2StepDto } from './dto/login-2-step.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private mailService: MailerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @ApiOkResponse(AUTH_SWAGGER_RESPONSE.LOGIN_SUCCESS)
  @ApiBadRequestResponse(AUTH_SWAGGER_RESPONSE.BAD_REQUEST_EXCEPTION)
  @ApiNotFoundResponse(AUTH_SWAGGER_RESPONSE.LOGIN_FAIL)
  @ApiInternalServerErrorResponse(AUTH_SWAGGER_RESPONSE.INTERNAL_SERVER_EXCEPTION)
  @ApiConsumes('application/x-www-form-urlencoded')
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }
  @ApiOkResponse(AUTH_SWAGGER_RESPONSE.LOGIN_SUCCESS)
  @ApiBadRequestResponse(AUTH_SWAGGER_RESPONSE.BAD_REQUEST_EXCEPTION)
  @ApiNotFoundResponse(AUTH_SWAGGER_RESPONSE.LOGIN_FAIL)
  @ApiInternalServerErrorResponse(AUTH_SWAGGER_RESPONSE.INTERNAL_SERVER_EXCEPTION)
  @ApiConsumes('application/x-www-form-urlencoded')
  @Post('/login-2-step')
  @HttpCode(HttpStatus.OK)
  async login2Step(@Body() login2StepDto: Login2StepDto): Promise<LoginResponseDto> {
    return this.authService.login2Step(login2StepDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('getUser/:id')
  getOne(@Param('id') id: string) {
    return this.authService.getOneUser(+id);
  }

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    const userRegister = await this.authService.register(user);
    await this.authService.sendEmails(userRegister.email, userRegister.code);
    return {
      message: 'Register successfully',
    };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: any) {
    return this.authService.googleLogin(req);
  }

  // async verifyEmail(mail: string, code: string) {
  //   const response = await this.mailService.sendMail({
  //     to: mail,
  //     from: 'hunghic@yopmail.com',
  //     subject: 'Plain Text Email ✔',
  //     html: `<a href="http://localhost:8080/api/v1/auth/verify-email?code=${code}">Verify email</a>`,
  //   });
  //   return response;
  // }
  @Get('verify-email')
  async getVerify(@Query() code: string) {
    return this.authService.verifyEmail(code);
  }
  @Get('verify-emails')
  async getVerifyPassword(@Query() code: string) {
    return this.authService.resetPassword(code);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  profile(@Req() request) {
    return {
      req: request.user.id,
    };
  }

  @Get('forgot-password')
  // @HttpCode(HttpStatus.BAD_REQUEST)
  async forGotPassword(@Body() user: forgotPasswordDto) {
    return this.authService.forgotPassword(user.email);
  }
  // @Get('getRedis')
  // async getRedis() {}
  @UseGuards(JwtAuthGuard)
  @Post('get-new-token')
  async getNewAccessToken(@Req() req, @Body() refreshToken: GetNewTokenDto) {
    const userId = req.user.id;
    return this.authService.getAccessToken(userId, refreshToken);
  }
}
// TODO
// get user by code => data
// data.exprisein * 1000 > date.now() => isVerfy = true => code = null, exprisein = null
// data.exprisein * 1000 < date.now() => return {message: 'nthoi gian hwetvha roi'} => mail

//login => email, password, isVerfy=true => login
