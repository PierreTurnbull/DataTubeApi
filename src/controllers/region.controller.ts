import { Controller, Get } from '@nestjs/common';
import { RegionService } from '../services/region.service';

@Controller('regions')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Get()
  async findAll() {
    return await this.regionService.findAll();
  }
}
