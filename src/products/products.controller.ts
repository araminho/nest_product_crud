import {
  Controller, Query, Get, Post, Patch, Body, Param, Delete, UploadedFile,
  ParseIntPipe, UseGuards, UseInterceptors, ClassSerializerInterceptor
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { PaginatedProductsResponseDto } from './dto/paginated-products-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { productMulterOptions } from '../common/multer-options';

@Controller('products')
// This interceptor will automatically respect @Exclude/@Expose in the DTOs
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', productMulterOptions))
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File, // This catches the file
  ): Promise<ProductResponseDto> {
    // We pass the file path to the service (it will be undefined if no file was uploaded)
    const product = await this.productsService.create(dto, file?.path);

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
  @UseInterceptors(FileInterceptor('image', productMulterOptions))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProductResponseDto> {
    // Pass the ID, the DTO, and the new file path to the service
    const product = await this.productsService.update(id, dto, file?.path);

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
