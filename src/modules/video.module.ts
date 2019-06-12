import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video as VideoEntity } from '../entities/video.entity';
import { VideoService } from '../services/video.service';
import { VideoController } from '../controllers/video.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VideoEntity])],
  providers: [VideoService],
  controllers: [VideoController],
})
export class VideoModule {}
