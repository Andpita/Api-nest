import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { productMock } from '../mocks/product.mock';
import { productDeleteMock } from '../mocks/productDelete.mock';
import { createProductMock } from '../mocks/createProduct.mock';
import { updateProductMock } from '../mocks/updateProduct.mock';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProductService,
          useValue: {
            findAllProducts: jest.fn().mockResolvedValue([productMock]),
            findProductById: jest.fn().mockResolvedValue(productMock),
            createProduct: jest.fn().mockResolvedValue(productMock),
            deleteProductById: jest.fn().mockResolvedValue(productDeleteMock),
            updateProduct: jest.fn().mockResolvedValue(updateProductMock),
          },
        },
      ],
      controllers: [ProductController],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(productService).toBeDefined();
  });

  it('should return all products (get)', async () => {
    const products = await controller.findAllProducts();

    expect(products).toEqual([
      {
        ...productMock,
        createdAt: undefined,
        updatedAt: undefined,
        category: undefined,
      },
    ]);
  });

  it('should return one product by id (get)', async () => {
    const products = await controller.findProductById(productMock.id);

    expect(products).toEqual({
      ...productMock,
      createdAt: undefined,
      updatedAt: undefined,
      category: undefined,
    });
  });

  it('should return a new product (post)', async () => {
    const products = await controller.createProduct(createProductMock);

    expect(products).toEqual(productMock);
  });

  it('should return delete product (delete)', async () => {
    const products = await controller.deleteProduct(productMock.id);

    expect(products).toEqual(productDeleteMock);
  });

  it('should return update product (put)', async () => {
    const products = await controller.updateProduct(
      productMock.id,
      updateProductMock,
    );

    expect(products).toEqual({
      ...updateProductMock,
      createdAt: undefined,
      updatedAt: undefined,
      category: undefined,
    });
  });
});
