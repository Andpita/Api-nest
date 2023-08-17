import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { CreateUserDTO } from 'src/dtos/createUser.dtos';
import { UserEntity } from 'src/interfaces/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    const _password = await hash(createUserDTO.password, 8);

    return this.userRepository.save({
      ...createUserDTO,
      password: _password,
      typeUser: 1,
    });
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }
}
