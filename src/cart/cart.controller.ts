import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from 'src/decorator/roles.decorator';
import { UserType } from 'src/user/enum/user-type.enum';
import { InsertCartDTO } from './dtos/insert-cart.dto';
import { CartEntity } from './entities/cart.entity';
import { UserId } from 'src/decorator/userId.decorator';
import { CartService } from './cart.service';

@Roles(UserType.User)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UsePipes(ValidationPipe)
  @Post()
  async insertItemCart(
    @UserId() userId: number,
    @Body()
    insertItem: InsertCartDTO,
  ): Promise<CartEntity> {
    return this.cartService.insertItemCart(userId, insertItem);
  }

  @UsePipes(ValidationPipe)
  @Get()
  async getCart(@UserId() userId: number): Promise<CartEntity> {
    return this.cartService.verifyActiveCart(userId);
  }
}
