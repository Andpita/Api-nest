import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductEntity } from '../entities/product.entity';
import { productMock } from '../mocks/product.mock';
import { Repository } from 'typeorm';
import { CategoryService } from '../../category/category.service';
import { CategoryEntity } from '../../category/entities/category.entity';
import { categoryMock } from '../../category/mocks/category.mock';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<ProductEntity>;
  let categoryRepository: Repository<CategoryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(productMock),
            find: jest.fn().mockResolvedValue([productMock]),
            findOne: jest.fn().mockResolvedValue(productMock),
          },
        },
        CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(categoryMock),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get(getRepositoryToken(ProductEntity));
    categoryRepository = module.get(getRepositoryToken(CategoryEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productRepository).toBeDefined();
    expect(categoryRepository).toBeDefined();
  });

  //Create New Product
  it('should return product after save', async () => {
    jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(categoryMock);

    const product = await service.createProduct(productMock);

    expect(product).toEqual(productMock);
  });

  it('should return error if categoty not exist', async () => {
    jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.createProduct(productMock)).rejects.toThrowError();
  });

  it('should return error if product exist', async () => {
    expect(service.createProduct(productMock)).rejects.toThrowError();
  });

  it('should return error to create new product', async () => {
    jest.spyOn(productRepository, 'save').mockRejectedValue(new Error());

    expect(service.createProduct(productMock)).rejects.toThrowError();
  });

  //List All Products
  it('should return list all products', async () => {
    const productsAll = await service.findAllProducts();

    expect(productsAll).toEqual([productMock]);
  });

  it('should return error in list products empty', async () => {
    jest.spyOn(productRepository, 'find').mockResolvedValue([]);

    expect(service.findAllProducts()).rejects.toThrow();
  });

  it('should return error if exception in products', async () => {
    jest.spyOn(productRepository, 'find').mockRejectedValue(new Error());

    expect(service.findAllProducts()).rejects.toThrow();
  });
});
