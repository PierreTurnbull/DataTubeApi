import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region as RegionEntity } from '../entities/region.entity';
import { VideoCategory as VideoCategoryEntity } from '../entities/video_category.entity';
import { Video as VideoEntity } from '../entities/video.entity';
import { RessourcesService } from '../services/ressources.service';
import { RessourcesController } from '../controllers/ressources.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoCategoryEntity, RegionEntity, VideoEntity]),
  ],
  providers: [RessourcesService],
  controllers: [RessourcesController],
})
export class RessourcesModule {}
