import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { UserType } from '../user/enum/user-type.enum';
import { Roles } from '../decorator/roles.decorator';
import { CreateCategoryDTO } from './dtos/createCategory.dto';
import { ReturnCategoryDTO } from './dtos/returnCategory.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(UserType.User, UserType.Admin, UserType.Root)
  @Get()
  @UsePipes(ValidationPipe)
  async findAllCategories(): Promise<ReturnCategoryDTO[]> {
    return await this.categoryService.findAllCategories();
  }

  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @Post()
  async createCategory(
    @Body() nameCategory: CreateCategoryDTO,
  ): Promise<ReturnCategoryDTO> {
    return new ReturnCategoryDTO(
      await this.categoryService.createCategory(nameCategory),
    );
  }
}
