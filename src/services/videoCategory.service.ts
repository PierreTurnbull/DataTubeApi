import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoCategory as VideoCategoryEntity } from '../entities/videoCategory.entity';

@Injectable()
export class VideoCategoryService {
  constructor(
    @InjectRepository(VideoCategoryEntity)
    private readonly videoCategoryRepository: Repository<VideoCategoryEntity>,
  ) {}

  async findAll() {
    const categories = await this.videoCategoryRepository.find();

    return categories.map(category => ({
      label: category.name,
      value: category.id,
    }));
  }
}
