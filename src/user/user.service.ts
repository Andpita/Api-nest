import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { CreateUserDTO } from '../user/dtos/createUser.dto';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserType } from './enum/user-type.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    const userCheck = await this.findUserByEmail(createUserDTO.email).catch(
      () => undefined,
    );

    if (userCheck) {
      throw new BadRequestException(`E-mail já cadastrado`);
    }

    const _password = await hash(createUserDTO.password, 8);

    return this.userRepository.save({
      ...createUserDTO,
      password: _password,
      typeUser: UserType.User,
    });
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async getUserByIdUsingRelations(userId: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: {
        addresses: {
          city: {
            state: true,
          },
        },
      },
    });
  }

  async findUserById(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuário (${userId}) não encontrado`);
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException(`(${email}) não existe`);
    }

    return user;
  }
}
