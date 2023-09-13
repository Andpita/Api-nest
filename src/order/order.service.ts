import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { PaymentService } from 'src/payment/payment.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderService: Repository<OrderEntity>,
    private readonly paymentService: PaymentService,
  ) {}

  async createOrder(newOrder: CreateOrderDTO, cartId: number) {
    await this.paymentService.createPayment(newOrder);
    return null;
  }
}
