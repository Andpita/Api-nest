import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../order.controller';
import { OrderService } from '../order.service';
import { orderMock } from '../mocks/order.mock';
import { createOrderMockPix } from '../mocks/createOrder.mock';
import { userMock } from '../../user/mocks/user.mock';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn().mockResolvedValue(orderMock),
            findMyOrders: jest.fn().mockResolvedValue([orderMock]),
          },
        },
      ],
      controllers: [OrderController],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(orderService).toBeDefined();
  });

  it('should create new order', async () => {
    const createOrder = await controller.createOrder(
      createOrderMockPix,
      userMock.id,
    );

    expect(createOrder).toEqual(orderMock);
  });

  it('should return all order to user by userId', async () => {
    const findOrder = await controller.myOrders(userMock.id);

    expect(findOrder).toEqual([orderMock]);
  });
});
