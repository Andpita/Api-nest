import { UpdateProductCartDTO } from 'src/cart/dtos/update-cart.dto';
import { cartProductMock } from './cart-product.mock';

export const updateProductMock: UpdateProductCartDTO = {
  productId: cartProductMock.productId,
  amount: 10,
};
