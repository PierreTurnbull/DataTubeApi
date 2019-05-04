import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoCategory as VideoCategoryEntity } from '../entities/video_category.entity';
import { VideoCategoryService } from '../services/video_category.service';
import { VideoCategoryController } from '../controllers/video_category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VideoCategoryEntity])],
  providers: [VideoCategoryService],
  controllers: [VideoCategoryController],
})
export class VideoCategoryModule {}
