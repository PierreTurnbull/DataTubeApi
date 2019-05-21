import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoCategory as VideoCategoryEntity } from '../entities/videoCategory.entity';
import { VideoCategoryService } from '../services/videoCategory.service';
import { VideoCategoryController } from '../controllers/videoCategory.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VideoCategoryEntity])],
  providers: [VideoCategoryService],
  controllers: [VideoCategoryController],
})
export class VideoCategoryModule {}
