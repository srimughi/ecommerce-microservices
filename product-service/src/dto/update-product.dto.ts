import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Price must be positive' })
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Stock cannot be negative' })
  stock?: number;
}
