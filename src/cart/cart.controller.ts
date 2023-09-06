import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from '../decorator/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { InsertCartDTO } from './dtos/insert-cart.dto';
import { UserId } from '../decorator/userId.decorator';
import { CartService } from './cart.service';
import { ReturnCartDTO } from './dtos/return-cart.dto';
import { DeleteResult } from 'typeorm';
import { UpdateProductCartDTO } from './dtos/update-cart.dto';

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
  ): Promise<ReturnCartDTO> {
    return new ReturnCartDTO(
      await this.cartService.insertItemCart(userId, insertItem),
    );
  }

  @UsePipes(ValidationPipe)
  @Get()
  async checkCart(@UserId() userId: number): Promise<ReturnCartDTO> {
    return new ReturnCartDTO(await this.cartService.checkCart(userId, true));
  }

  @Delete()
  async clearCart(@UserId() userId: number): Promise<DeleteResult> {
    return this.cartService.clearCart(userId);
  }

  @Delete('/product/:productId')
  async deleteProductCart(
    @Param('productId') productId: number,
    @UserId() userId: number,
  ): Promise<DeleteResult> {
    return this.cartService.deleteProductCart(productId, userId);
  }

  @UsePipes(ValidationPipe)
  @Patch()
  async updateProductCart(
    @UserId() userId: number,
    @Body()
    updateProduct: UpdateProductCartDTO,
  ): Promise<ReturnCartDTO> {
    return new ReturnCartDTO(
      await this.cartService.updateProductCart(updateProduct, userId),
    );
  }
}
