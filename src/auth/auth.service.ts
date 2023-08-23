import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDTO } from './dtos/login.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ReturnLoginDTO } from './dtos/returnLogin.dto';
import { PayloadDTO } from './dtos/payload.dto';
import { ReturnUserDTO } from 'src/user/dtos/returnUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginData: LoginDTO): Promise<ReturnLoginDTO> {
    const user: UserEntity | undefined = await this.userService
      .findUserByEmail(loginData.email)
      .catch(() => undefined);

    const decrypt = await compare(loginData.password, user?.password || 's');

    if (!user || !decrypt) {
      throw new NotFoundException('E-mail ou senha inválido.');
    }

    return {
      accessToken: await this.jwtService.signAsync({ ...new PayloadDTO(user) }),
      user: new ReturnUserDTO(user),
    };
  }
}
