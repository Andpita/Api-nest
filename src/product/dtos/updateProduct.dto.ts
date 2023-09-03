import { IsInt, IsNumber, IsString } from 'class-validator';

export class UpdateProductDTO {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  image: string;

  @IsInt()
  categoryId: number;
}
