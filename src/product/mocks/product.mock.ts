import { categoryMock } from '../../category/mocks/category.mock';
import { CreateProductDTO } from '../dtos/createProduct.dto';

export const productMock: CreateProductDTO = {
  categoryId: categoryMock.id,
  image: 'http://image/mockimage.img',
  name: 'MockTenis',
  price: 399.9,
};
