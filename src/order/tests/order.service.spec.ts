import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../order.service';
import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentService } from '../../payment/payment.service';
import { ProductService } from '../../product/product.service';
import { OrderProductService } from '../../order-product/order-product.service';
import { CartService } from '../../cart/cart.service';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<OrderEntity>;
  let paymentService: PaymentService;
  let productService: ProductService;
  let orderProductService: OrderProductService;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(0),
            find: jest.fn().mockResolvedValue([0]),
          },
        },
        {
          provide: CartService,
          useValue: {
            checkCart: jest.fn().mockResolvedValue(0),
            clearCart: jest.fn().mockResolvedValue(0),
          },
        },
        {
          provide: OrderProductService,
          useValue: {
            reateOrderProduct: jest.fn().mockResolvedValue(0),
          },
        },
        {
          provide: ProductService,
          useValue: {
            findAllProducts: jest.fn().mockResolvedValue(0),
          },
        },
        {
          provide: PaymentService,
          useValue: {
            createPayment: jest.fn().mockResolvedValue(0),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get(getRepositoryToken(OrderEntity));
    cartService = module.get<CartService>(CartService);
    orderProductService = module.get<OrderProductService>(OrderProductService);
    productService = module.get<ProductService>(ProductService);
    paymentService = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(orderRepository).toBeDefined();
    expect(cartService).toBeDefined();
    expect(orderProductService).toBeDefined();
    expect(productService).toBeDefined();
    expect(paymentService).toBeDefined();
  });
});
