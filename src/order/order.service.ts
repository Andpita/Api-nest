import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { PaymentService } from 'src/payment/payment.service';
import { PaymentEntity } from 'src/payment/entities/payment.entity';
import { CartService } from 'src/cart/cart.service';
import { OrderProductService } from 'src/order-product/order-product.service';
import { ProductService } from 'src/product/product.service';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { OrderProductEntity } from 'src/order-product/entities/order-product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly paymentService: PaymentService,
    private readonly cartService: CartService,
    private readonly orderProductService: OrderProductService,
    private readonly productService: ProductService,
  ) {}

  async saveOrder(
    newOrder: CreateOrderDTO,
    payment: PaymentEntity,
    userId: number,
  ): Promise<OrderEntity> {
    return this.orderRepository.save({
      addressId: newOrder.addressId,
      date: new Date(),
      paymentId: payment.id,
      userId,
    });
  }

  async createOrderProductsInCart(
    cart: CartEntity,
    orderId: number,
    products: ProductEntity[],
  ): Promise<OrderProductEntity[]> {
    return Promise.all(
      cart.cartProduct?.map((cartProduct) =>
        this.orderProductService.createOrderProduct(
          cartProduct.productId,
          orderId,
          cartProduct.amount,
          products.find((product) => product.id === cartProduct.productId)
            ?.price || 0,
        ),
      ),
    );
  }

  async createOrder(
    newOrder: CreateOrderDTO,
    userId: number,
  ): Promise<OrderEntity> {
    const payment = await this.paymentService.createPayment(newOrder);
    const order = await this.saveOrder(newOrder, payment, userId);
    const cart = await this.cartService.checkCart(userId, true);

    const products = await this.productService.findAllProducts(
      cart.cartProduct?.map((product) => product.productId),
    );

    await this.createOrderProductsInCart(cart, order.id, products);

    await this.cartService.clearCart(userId);

    return order;
  }
}
