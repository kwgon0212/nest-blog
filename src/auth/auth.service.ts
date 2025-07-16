import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    return this.userRepository.createUser(authCredentialDto);
  }

  async signIn(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialDto;

    const user = await this.userRepository.findOne(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      // 유저 토큰 생성 (payload + secret key)
      const payload = { username }; // 넣고 싶은 정보들 (중요한 정보들 제외)
      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('로그인 실패');
    }
  }
}
