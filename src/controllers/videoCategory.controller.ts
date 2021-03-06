import { Controller, Get } from '@nestjs/common';
import { VideoCategoryService } from '../services/videoCategory.service';

@Controller('categories')
export class VideoCategoryController {
  constructor(private readonly videoCategoryService: VideoCategoryService) {}

  @Get()
  async findAll() {
    return await this.videoCategoryService.findAll();
  }
}
