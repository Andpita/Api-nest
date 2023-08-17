import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDTO } from 'src/dtos/createUser.dtos';
import { UserService } from './user.service';
import { UserEntity } from 'src/interfaces/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<UserEntity[]> {
    return this.userService.getAllUsers();
  }

  @Post()
  async createUser(@Body() createUser: CreateUserDTO): Promise<UserEntity> {
    return this.userService.createUser(createUser);
  }
}
