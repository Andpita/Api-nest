import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../category.service';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { categoryMock } from '../mocks/category.mock';
import { createCategoryMock } from '../mocks/createCategory.mock';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<CategoryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(categoryMock),
            find: jest.fn().mockResolvedValue([categoryMock]),
            findOne: jest.fn().mockResolvedValue(categoryMock),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get(getRepositoryToken(CategoryEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryRepository).toBeDefined();
  });

  //FindAll
  it('should return list all categories', async () => {
    const categories = await service.findAllCategories();

    expect(categories).toEqual([categoryMock]);
  });

  it('should return error in list categories empty', async () => {
    jest.spyOn(categoryRepository, 'find').mockResolvedValue([]);

    expect(service.findAllCategories()).rejects.toThrow();
  });

  it('should return error if exception in categoryRepository', async () => {
    jest.spyOn(categoryRepository, 'find').mockRejectedValue(new Error());

    expect(service.findAllCategories()).rejects.toThrowError();
  });

  //Save
  it('should return category after save', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

    const category = await service.createCategory(createCategoryMock);

    expect(category).toEqual(categoryMock);
  });

  it('should return error in exception in createCategory', async () => {
    jest.spyOn(categoryRepository, 'save').mockRejectedValue(new Error());

    expect(service.createCategory(createCategoryMock)).rejects.toThrowError();
  });

  it('should return error if duplicate name category', async () => {
    expect(service.createCategory(createCategoryMock)).rejects.toThrowError();
  });

  //FindOne
  it('should return one category by name', async () => {
    const category = await service.findOneCategory(categoryMock.name);

    expect(category).toEqual(categoryMock);
  });

  it('should return one category by id', async () => {
    const category = await service.findOneCategoryById(categoryMock.id);

    expect(category).toEqual(categoryMock);
  });

  it('should return error category by name not exist', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findOneCategory(categoryMock.name)).rejects.toThrowError();
  });

  it('should return error category by name not exist', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findOneCategoryById(categoryMock.id)).rejects.toThrowError();
  });

  it('should return error exception category findOne', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockRejectedValue(new Error());

    expect(service.findOneCategory(categoryMock.name)).rejects.toThrowError();
  });
});
