import { Expose, Type } from 'class-transformer';
import { CategoryResponseDto } from './category-response.dto';

export class PaginatedCategoriesResponseDto {
  @Expose()
  @Type(() => CategoryResponseDto)
  data: CategoryResponseDto[];

  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  lastPage: number;
}