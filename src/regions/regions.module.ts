
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionsEntity } from './regions.entity';
import { RegionsService } from './regions.service';
import { RegionsController } from './regions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RegionsEntity])],
  providers: [RegionsService],
  controllers: [RegionsController]
})
export class RegionsModule { }