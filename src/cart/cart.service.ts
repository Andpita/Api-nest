import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { InsertCartDTO } from './dtos/insert-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {}

  async verifyActiveCart(userId: number): Promise<CartEntity> {
    const cartActive = await this.cartRepository.findOne({
      where: { userId },
    });

    if (!cartActive) {
      throw new NotFoundException(`Nenhum carrinho ativo`);
    }

    return cartActive;
  }

  async createCart(userId: number): Promise<CartEntity> {
    const newCart = this.cartRepository.save({
      active: true,
      userId: userId,
    });

    return newCart;
  }

  async insertItemCart(
    userId: number,
    insertItem: InsertCartDTO,
  ): Promise<CartEntity> {
    const cart = this.verifyActiveCart(userId).catch(async () => {
      return await this.createCart(userId);
    });

    return cart;
  }
}
