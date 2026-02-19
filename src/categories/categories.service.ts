import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';

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

  async findAll(): Promise<Category[]> {
    return this.categoryRepo.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) throw new NotFoundException('Category not found');

    if (dto.title !== undefined) category.title = dto.title;

    return this.categoryRepo.save(category);
  }

  async remove(id: number) {
    // Load category with its products
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['products'], // important
    });

    if (!category) throw new NotFoundException('Category not found');

    // Prevent deletion if products exist
    if (category.products.length > 0) {
      throw new BadRequestException(
        'Cannot delete category because it has products',
      );
    }

    await this.categoryRepo.delete(id);
  }

}
