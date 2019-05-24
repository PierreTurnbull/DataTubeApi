import { Controller, Get, Query } from '@nestjs/common';
import { VideoService } from '../services/video.service';
import { GetVideosQuery } from '../DTOs/request/query/getVideos.query.dto'

@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  async findAll(@Query() getVideosQuery: GetVideosQuery) {
    return await this.videoService.findAll(getVideosQuery);
  }
}
