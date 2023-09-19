import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { OrderService } from './order.service';
import { UserId } from '../decorator/userId.decorator';
import { OrderEntity } from './entities/order.entity';
import { Roles } from '../decorator/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { ReturnOrderDTO } from './dtos/return-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(UserType.Admin, UserType.User)
  @Post()
  @UsePipes(ValidationPipe)
  async createOrder(
    @Body() newOrder: CreateOrderDTO,
    @UserId() userId: number,
  ) {
    return this.orderService.createOrder(newOrder, userId);
  }

  @Roles(UserType.Admin, UserType.User)
  @Get()
  async myOrders(@UserId() userId: number): Promise<OrderEntity[]> {
    return this.orderService.findMyOrders(userId);
  }

  @Roles(UserType.Admin)
  @Get('/all')
  async allOrdersAdm(): Promise<ReturnOrderDTO[]> {
    return (await this.orderService.allOrders()).map(
      (order) => new ReturnOrderDTO(order),
    );
  }

  @Roles(UserType.Admin)
  @Get('/:orderId')
  async orderIdAdm(
    @Param('orderId') orderId: number,
  ): Promise<ReturnOrderDTO[]> {
    return (await this.orderService.findMyOrders(undefined, orderId)).map(
      (order) => new ReturnOrderDTO(order),
    );
  }
}
