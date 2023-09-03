import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDTO } from '../user/dtos/createUser.dto';
import { UserService } from './user.service';
import { UserEntity } from '../user/entities/user.entity';
import { ReturnUserDTO } from './dtos/returnUser.dto';
import { UpdatePasswordDTO } from './dtos/updatePassword.dto';
import { UserId } from '../decorator/userId.decorator';
import { UserType } from './enum/user-type.enum';
import { Roles } from 'src/decorator/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserType.Admin)
  @Get()
  async getAllUsers(): Promise<ReturnUserDTO[]> {
    return (await this.userService.getAllUsers()).map(
      (user) => new ReturnUserDTO(user),
    );
  }

  @UsePipes(ValidationPipe)
  @Post()
  async createUser(@Body() createUser: CreateUserDTO): Promise<UserEntity> {
    return this.userService.createUser(createUser);
  }

  @Roles(UserType.Admin)
  @Get('/:userId')
  async getUserById(@Param('userId') userId: number): Promise<ReturnUserDTO> {
    const user = new ReturnUserDTO(
      await this.userService.getUserByIdUsingRelations(userId),
    );

    return user;
  }

  @Patch()
  @UsePipes(ValidationPipe)
  async updateUserPassword(
    @UserId() userId: number,
    @Body() newPassword: UpdatePasswordDTO,
  ): Promise<ReturnUserDTO> {
    const user = new ReturnUserDTO(
      await this.userService.updateUserPassword(userId, newPassword),
    );

    return user;
  }
}
