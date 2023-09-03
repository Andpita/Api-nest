import { categoryMock } from '../../category/mocks/category.mock';
import { ProductEntity } from '../entities/product.entity';

export const productMock: ProductEntity = {
  id: 123,
  categoryId: categoryMock.id,
  image: 'http://image/mockimage.img',
  name: 'MockTenis',
  price: 399.9,
  createdAt: new Date(),
  updatedAt: new Date(),
};
