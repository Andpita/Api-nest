import { cartMock } from '../../cart/mocks/cart.mock';
import { CartProductEntity } from '../entities/cart-product.entity';
import { productMock } from '../../product/mocks/product.mock';

export const cartProductMock: CartProductEntity = {
  id: 1,
  cartId: cartMock.id,
  productId: productMock.id,
  amount: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};
