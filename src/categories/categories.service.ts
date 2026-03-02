import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(title: string): Promise<Category> {
    const category = this.categoryRepo.create({ title });
    return this.categoryRepo.save(category);
  }

  async findAll(dto: PaginationDto): Promise<{
    data: Category[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    const { page, limit } = dto;

    const [data, total] = await this.categoryRepo.findAndCount({
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

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    // 1. Preload tries to find the entity by ID and maps the DTO onto it
    const category = await this.categoryRepo.preload({
      id,
      ...dto,
    });

    // 2. If preload returns undefined, the ID doesn't exist in the DB
    if (!category) {
      throw new NotFoundException(`Category not found`);
    }

    // 3. Save the merged entity
    return this.categoryRepo.save(category);
  }

  async remove(id: number) {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) throw new NotFoundException('Category not found');

    if (category.products.length > 0) {
      throw new BadRequestException(
        'Cannot delete category because it has products',
      );
    }

    await this.categoryRepo.delete(id);

    return { message: `Category "${category.title}" successfully deleted` };
  }

}
