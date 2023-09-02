import { ReturnCategoryDTO } from '../../category/dtos/returnCategory.dto';
import { ProductEntity } from '../entities/product.entity';

export class ReturnProductDTO {
  name: string;
  price: number;
  image: string;
  categoryId: number;
  category?: ReturnCategoryDTO;

  constructor(product: ProductEntity) {
    this.name = product.name;
    this.price = product.price;
    this.image = product.image;
    this.categoryId = product.categoryId;
    this.category = product.category
      ? new ReturnCategoryDTO(product.category)
      : undefined;
  }
}
