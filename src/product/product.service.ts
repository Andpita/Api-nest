import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDTO } from './dtos/createProduct.dto';
import { ReturnProductDTO } from './dtos/returnProduct.dto';
import { CategoryService } from './../category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoryService,
  ) {}

  //create
  async createProduct(product: CreateProductDTO): Promise<ReturnProductDTO> {
    const productCheck = await this.findProduct(product.name).catch(
      () => undefined,
    );

    const categoryCheck = await this.categoryService.findOneCategoryById(
      product.categoryId,
    );

    if (productCheck) {
      throw new BadRequestException(`Produto ${product.name} já cadastrado`);
    }

    if (!categoryCheck) {
      throw new BadRequestException(`Categoria ${categoryCheck} não existe`);
    }

    return new ReturnProductDTO(await this.productRepository.save(product));
  }

  //find
  async findProduct(name: string): Promise<ProductEntity> {
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

  //findAll
  async findAllProducts(): Promise<ProductEntity[]> {
    const products = await this.productRepository.find();

    if (!products || products.length === 0) {
      throw new NotFoundException(`Nenhum produto encontrado`);
    }

    return products;
  }
}
