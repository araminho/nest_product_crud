import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from '../categories/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepo.findOneBy({ id: dto.categoryId });
    if (!category) throw new NotFoundException('Category not found');

    const product = this.productRepo.create({
      name: dto.name,
      price: dto.price,
      description: dto.description,
      category,
    });

    return this.productRepo.save(product);
  }

  async findAll(dto: PaginationDto): Promise<{
    data: Product[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    const { page, limit } = dto;

    const [data, total] = await this.productRepo.findAndCount({
      relations: ['category'],
      order: { id: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const { categoryId, ...updateData } = dto;

    // 1. Preload the product with the basic fields (name, price, etc.)
    const product = await this.productRepo.preload({
      id,
      ...updateData,
    });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    // 2. Handle the category relation safety check
    if (categoryId) {
      const category = await this.categoryRepo.findOneBy({ id: categoryId });
      if (!category) {
        throw new NotFoundException(`Category not found`);
      }
      product.category = category;
    }

    // 3. Save the merged entity (only updates changed columns)
    return this.productRepo.save(product);
  }

  async remove(id: number) {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');

    await this.productRepo.delete(id);

    return { message: `Product "${product.name}" successfully deleted` };
  }
}
