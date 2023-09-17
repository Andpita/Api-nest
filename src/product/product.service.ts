import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { DeleteResult, In, Repository } from 'typeorm';
import { CreateProductDTO } from './dtos/createProduct.dto';
import { CategoryService } from './../category/category.service';
import { UpdateProductDTO } from './dtos/updateProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoryService,
  ) {}

  //create
  async createProduct(product: CreateProductDTO): Promise<ProductEntity> {
    const productCheck = await this.findProductByName(product.name).catch(
      () => undefined,
    );

    await this.categoryService.findOneCategoryById(product.categoryId);

    if (productCheck) {
      throw new BadRequestException(`Produto ${product.name} já cadastrado`);
    }

    return await this.productRepository.save(product);
  }

  //find
  async findProductByName(name: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {
        name,
      },
    });

    if (!product) {
      throw new BadRequestException(`Produto ${name} não encontrado`);
    }

    return product;
  }

  async findProductById(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
      relations: { category: true },
    });

    if (!product) {
      throw new BadRequestException(`Produto ${id} não encontrado`);
    }

    return product;
  }

  //findAll
  async findAllProducts(
    productId?: number[],
    relationsCategory?: boolean,
  ): Promise<ProductEntity[]> {
    let findOptions = {};

    if (productId && productId.length > 0) {
      findOptions = {
        where: {
          id: In(productId),
        },
      };
    }

    if (relationsCategory) {
      findOptions = { ...findOptions, relations: { category: true } };
    }

    const products = await this.productRepository.find(findOptions);

    if (!products || products.length === 0) {
      throw new NotFoundException(`Nenhum produto encontrado`);
    }

    return products;
  }

  //delete
  async deleteProductById(id: number): Promise<DeleteResult> {
    const productDelete = await this.findProductById(id);

    if (!productDelete) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }

    return await this.productRepository.delete(id);
  }

  //update
  async updateProduct(
    idProduct: number,
    updateProduct: UpdateProductDTO,
  ): Promise<ProductEntity> {
    const product = await this.findProductById(idProduct).catch(
      () => undefined,
    );

    if (!product) {
      throw new BadRequestException(`Produto ${idProduct} não encontrado`);
    }

    await this.categoryService.findOneCategoryById(updateProduct.categoryId);

    return await this.productRepository.save({
      ...product,
      ...updateProduct,
    });
  }
}
