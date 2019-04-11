import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region as RegionEntity } from '../entities/region.entity';
import { RegionService } from '../services/region.service';
import { RegionController } from '../controllers/region.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RegionEntity])],
  providers: [RegionService],
  controllers: [RegionController],
})
export class RegionModule {}
