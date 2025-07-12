import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialDto {
  @IsString()
  @MinLength(4, { message: '아이디는 4자 이상으로 입력해주세요.' })
  @MaxLength(20, { message: '아이디는 20자 이하로 입력해주세요.' })
  username: string;

  @IsString()
  @MinLength(4, { message: '비밀번호는 4자 이상으로 입력해주세요.' })
  @MaxLength(20, { message: '비밀번호는 20자 이하로 입력해주세요.' })
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '비밀번호는 영문과 숫자만 가능합니다.',
  })
  password: string;
}
