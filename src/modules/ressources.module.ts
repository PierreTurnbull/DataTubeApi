import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region as RegionEntity } from '../entities/region.entity';
import { VideoCategory as VideoCategoryEntity } from '../entities/videoCategory.entity';
import { Video as VideoEntity } from '../entities/video.entity';
import { Tag as TagEntity } from '../entities/tag.entity';
import { RessourcesService } from '../services/ressources.service';
import { RessourcesController } from '../controllers/ressources.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VideoCategoryEntity,
      RegionEntity,
      VideoEntity,
      TagEntity,
    ]),
  ],
  providers: [RessourcesService],
  controllers: [RessourcesController],
})
export class RessourcesModule {}
