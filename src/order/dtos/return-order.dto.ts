import { ReturnUserDTO } from '../../user/dtos/returnUser.dto';
import { OrderEntity } from '../entities/order.entity';
import { ReturnAddressDTO } from '../../address/dtos/returnAddress.dto';

export class ReturnOrderDTO {
  id: number;
  date: string;
  user?: ReturnUserDTO;
  address?: ReturnAddressDTO;

  constructor(order: OrderEntity) {
    this.id = order.id;
    this.date = order.date.toString();
    this.user = order.user ? new ReturnUserDTO(order.user) : undefined;
    this.address = order.address
      ? new ReturnAddressDTO(order.address)
      : undefined;
  }
}
