import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from './../decorator/roles.decorator';
import { UserType } from './../user/enum/user-type.enum';
import { ReturnProductDTO } from './dtos/returnProduct.dto';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dtos/createProduct.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(UserType.User, UserType.Admin)
  @Get()
  @UsePipes(ValidationPipe)
  async findAllProducts(): Promise<ReturnProductDTO[]> {
    return (await this.productService.findAllProducts()).map(
      (product) => new ReturnProductDTO(product),
    );
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Post()
  async createProduct(
    @Body() product: CreateProductDTO,
  ): Promise<ReturnProductDTO> {
    return await this.productService.createProduct(product);
  }
}
