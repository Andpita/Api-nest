import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateOrderDTO } from './dtos/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderService: Repository<OrderEntity>,
  ) {}

  async createOrder(newOrder: CreateOrderDTO, cartId: number) {
    console.log(newOrder, cartId);
    return null;
  }
}
