import {
  Controller, Query, Get, Post, Patch, Body, Param, Delete,
  ParseIntPipe, UseGuards, UseInterceptors, ClassSerializerInterceptor
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { PaginatedProductsResponseDto } from './dto/paginated-products-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
// This interceptor will automatically respect @Exclude/@Expose in the DTOs
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.productsService.create(dto);
    return plainToInstance(ProductResponseDto, product, { excludeExtraneousValues: true });
  }

  @Get()
  async findAll(@Query() dto: PaginationDto): Promise<PaginatedProductsResponseDto> {
    const result = await this.productsService.findAll(dto);
    return plainToInstance(PaginatedProductsResponseDto, result, { excludeExtraneousValues: true });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    const product = await this.productsService.findOne(id);
    return plainToInstance(ProductResponseDto, product, { excludeExtraneousValues: true });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productsService.update(id, dto);

    // Convert the Entity back to the DTO for the response
    return plainToInstance(ProductResponseDto, product, {
      excludeExtraneousValues: true
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
