import { IsInt, IsNumber, IsString } from 'class-validator';

export class CreateProductDTO {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  image: string;

  @IsInt()
  categoryId: number;
}
