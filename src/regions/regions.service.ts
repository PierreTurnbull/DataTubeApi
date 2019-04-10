import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegionsEntity } from './regions.entity'

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(RegionsEntity)
    private readonly regionsRepository: Repository<RegionsEntity>
  ){}

  async findAll() {
    return await this.regionsRepository.find()
  }
}