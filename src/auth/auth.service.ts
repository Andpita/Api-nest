import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDTO } from './dtos/login.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(loginData: LoginDTO): Promise<UserEntity> {
    const user: UserEntity | undefined = await this.userService
      .findUserByEmail(loginData.email)
      .catch(() => undefined);

    const decrypt = await compare(loginData.password, user?.password || 's');

    if (!user || !decrypt) {
      throw new NotFoundException('E-mail ou senha inválido.');
    }

    return user;
  }
}
