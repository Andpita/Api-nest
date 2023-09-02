import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDTO } from './dtos/createCategory.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAllCategories(): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepository.find();

    if (!categories || categories.length === 0) {
      throw new NotFoundException(`Nenhuma categoria encontrada`);
    }

    return categories;
  }

  async findOneCategory(name: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: {
        name,
      },
    });

    if (!category) {
      throw new BadRequestException(`Categoria ${name} não encontrada`);
    }

    return category;
  }

  async findOneCategoryById(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });

    if (!category) {
      throw new BadRequestException(`Categoria ${id} não encontrada`);
    }

    return category;
  }

  async createCategory(category: CreateCategoryDTO): Promise<CategoryEntity> {
    const categoryCheck = await this.findOneCategory(category.name).catch(
      () => undefined,
    );

    if (categoryCheck) {
      throw new BadRequestException(`Categoria já cadastrada`);
    }

    return await this.categoryRepository.save(category);
  }
}
