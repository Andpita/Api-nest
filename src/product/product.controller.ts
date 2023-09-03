import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from './../decorator/roles.decorator';
import { UserType } from './../user/enum/user-type.enum';
import { ReturnProductDTO } from './dtos/returnProduct.dto';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dtos/createProduct.dto';
import { DeleteResult } from 'typeorm';
import { UpdateProductDTO } from './dtos/updateProduct.dto';

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

  @Roles(UserType.User, UserType.Admin)
  @UsePipes(ValidationPipe)
  @Get('/:id')
  async findProductById(@Param('id') id: number): Promise<ReturnProductDTO> {
    return new ReturnProductDTO(await this.productService.findProductById(id));
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Post()
  async createProduct(
    @Body() product: CreateProductDTO,
  ): Promise<ReturnProductDTO> {
    return await this.productService.createProduct(product);
  }

  @Roles(UserType.Admin)
  @Delete('/:productId')
  async deleteProduct(
    @Param('productId') productId: number,
  ): Promise<DeleteResult> {
    return await this.productService.deleteProductById(productId);
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Put('/:id')
  async updateProduct(
    @Param('id') id: number,
    @Body()
    product: UpdateProductDTO,
  ): Promise<ReturnProductDTO> {
    return await this.productService.updateProduct(id, product);
  }
}
