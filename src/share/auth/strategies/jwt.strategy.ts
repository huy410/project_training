import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_CONFIG } from '../../../configs/constant.config';
import { JwtPayload } from '../payloads/jwt-payload';
import { UserEntity } from '../../../api/user/user.entity';
import { UserRepository } from '../../../api/user/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONFIG.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const user = await this.userRepository.findOneByCondition({ id: payload.id });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
