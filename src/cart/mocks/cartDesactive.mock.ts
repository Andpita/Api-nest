import { userMock } from '../../user/mocks/user.mock';
import { CartEntity } from '../entities/cart.entity';

export const cartDesativeMock: CartEntity = {
  id: 321,
  userId: userMock.id,
  active: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};
