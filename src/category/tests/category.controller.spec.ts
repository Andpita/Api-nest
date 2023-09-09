import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '../category.controller';
import { CategoryService } from '../category.service';
import { categoryMock } from '../mocks/category.mock';
import { createCategoryMock } from '../mocks/createCategory.mock';

describe('CategoryController', () => {
  let controller: CategoryController;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CategoryService,
          useValue: {
            findAllCategories: jest.fn().mockResolvedValue([categoryMock]),
            createCategory: jest.fn().mockResolvedValue(categoryMock),
          },
        },
      ],
      controllers: [CategoryController],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(categoryService).toBeDefined();
  });

  it('should return all categories (get)', async () => {
    const categories = await controller.findAllCategories();

    expect(categories).toEqual([
      {
        id: categoryMock.id,
        name: categoryMock.name,
      },
    ]);
  });

  it('should return all categories (get)', async () => {
    const categories = await controller.createCategory(createCategoryMock);

    expect(categories).toEqual({
      ...categoryMock,
      createdAt: undefined,
      updatedAt: undefined,
    });
  });
});
