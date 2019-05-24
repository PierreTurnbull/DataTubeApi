import { Injectable } from '@nestjs/common';
import { Repository, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Video as VideoEntity } from '../entities/video.entity';
import { GetVideosQuery } from '../DTOs/request/query/getVideos.query.dto'

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videosRepository: Repository<VideoEntity>,
  ) {}

  async findAll(getVideosQuery: GetVideosQuery) {
    let videos = await this.videosRepository
      .createQueryBuilder('video')
      .innerJoinAndSelect('video.videoCategory', 'videoCategory')
      .innerJoinAndSelect('video.regions', 'regions')
    if (getVideosQuery.videoCategory !== undefined) {
      videos = videos.where('videoCategory.name = :videoCategory', { videoCategory: getVideosQuery.videoCategory })
    }
    if (getVideosQuery.region !== undefined) {
      videos = videos.andWhere('regions.name = :region', { region: getVideosQuery.region })
    }
    return (await videos.getManyAndCount())[1];
  }
}
