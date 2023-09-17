import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductEntity } from '../entities/product.entity';
import { productMock } from '../mocks/product.mock';
import { In, Repository } from 'typeorm';
import { CategoryService } from '../../category/category.service';
import { CategoryEntity } from '../../category/entities/category.entity';
import { categoryMock } from '../../category/mocks/category.mock';
import { productDeleteMock } from '../mocks/productDelete.mock';
import { updateProductMock } from '../mocks/updateProduct.mock';
import { BadRequestException } from '@nestjs/common';

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
            delete: jest.fn().mockResolvedValue(productDeleteMock),
            put: jest.fn().mockResolvedValue(productMock),
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
    jest.spyOn(productRepository, 'findOne').mockResolvedValue(productMock);
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

  it('should return list all products with relations', async () => {
    const spy = jest.spyOn(productRepository, 'find');
    const productsAll = await service.findAllProducts([], true);

    expect(productsAll).toEqual([productMock]);
    expect(spy.mock.calls[0][0]).toEqual({
      relations: { category: true },
    });
  });

  it('should return list all products with relations and array', async () => {
    const spy = jest.spyOn(productRepository, 'find');
    const productsAll = await service.findAllProducts([1], true);

    expect(productsAll).toEqual([productMock]);
    expect(spy.mock.calls[0][0]).toEqual({
      where: {
        id: In([1]),
      },
      relations: { category: true },
    });
  });

  it('should return error in list products empty', async () => {
    jest.spyOn(productRepository, 'find').mockResolvedValue([]);

    expect(service.findAllProducts()).rejects.toThrow();
  });

  it('should return error if exception in products', async () => {
    jest.spyOn(productRepository, 'find').mockRejectedValue(new Error());

    expect(service.findAllProducts()).rejects.toThrow();
  });

  //FindOneProductByName
  it('should return list all products', async () => {
    const product = await service.findProductByName(productMock.name);

    expect(product).toEqual(productMock);
  });

  it('should return error if not found product', async () => {
    jest.spyOn(productRepository, 'findOne').mockRejectedValue(new Error());

    expect(service.findProductByName(productMock.name)).rejects.toThrow();
    expect(service.findProductById(productMock.id)).rejects.toThrow();
  });

  it('should return error if not found product', async () => {
    jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findProductByName(productMock.name)).rejects.toThrow();
    expect(service.findProductById(productMock.id)).rejects.toThrow();
  });

  it('should return error if exception in product', async () => {
    jest.spyOn(productRepository, 'findOne').mockRejectedValue(new Error());

    expect(service.findProductByName(productMock.name)).rejects.toThrow();
    expect(service.findProductById(productMock.id)).rejects.toThrow();
  });

  //FindOneProductById
  it('should return list all products', async () => {
    const product = await service.findProductById(productMock.id);

    expect(product).toEqual(productMock);
  });

  //Delete product
  it('should return delete result if delete product', async () => {
    const product = await service.deleteProductById(productMock.id);

    expect(product).toEqual(productDeleteMock);
  });

  it('should return error if product not fount for delete', async () => {
    jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.deleteProductById(productMock.id)).rejects.toThrowError(
      BadRequestException,
    );
  });

  it('should return error if exception in product delete', async () => {
    jest.spyOn(productRepository, 'delete').mockRejectedValue(new Error());

    expect(service.deleteProductById(productMock.id)).rejects.toThrowError();
  });

  //Update product
  it('should return products after update', async () => {
    const product = await service.updateProduct(
      productMock.id,
      updateProductMock,
    );

    expect(product).toEqual(productMock);
  });

  it('should return error if exception in product update', async () => {
    jest.spyOn(productRepository, 'save').mockRejectedValue(new Error());

    expect(
      service.updateProduct(productMock.id, updateProductMock),
    ).rejects.toThrowError();
  });

  it('should return error if not found product for update', async () => {
    jest.spyOn(productRepository, 'findOne').mockRejectedValue(undefined);

    expect(
      service.updateProduct(productMock.id, updateProductMock),
    ).rejects.toThrowError();
  });
});
