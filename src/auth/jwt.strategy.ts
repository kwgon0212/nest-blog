import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      secretOrKey: process.env.JWT_SECRET_KEY!,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: { username: string }) {
    const { username } = payload;
    const user: User | null = await this.userRepository.findOne(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
