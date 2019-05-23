import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Region as RegionEntity } from '../entities/region.entity';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(RegionEntity)
    private readonly regionsRepository: Repository<RegionEntity>,
  ) {}

  async findAll() {
    const regions = await this.regionsRepository.find();

    return regions.map(region => ({
      label: region.name,
      value: region.id,
    }));
  }
}
