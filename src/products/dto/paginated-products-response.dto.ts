import { Expose, Type } from 'class-transformer';
import { ProductResponseDto } from './product-response.dto';

export class PaginatedProductsResponseDto {
  @Expose()
  @Type(() => ProductResponseDto)
  data: ProductResponseDto[];

  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  lastPage: number;
}