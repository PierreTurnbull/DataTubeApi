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
    if (getVideosQuery.videoCategoryId !== undefined) {
      videos = videos.andWhere('videoCategory.id = :videoCategoryId', { videoCategoryId: getVideosQuery.videoCategoryId })
    }
    if (getVideosQuery.regionId !== undefined) {
      videos = videos.andWhere('regions.id = :regionId', { regionId: getVideosQuery.regionId })
    }
    if (getVideosQuery.range !== undefined) {
      const range = getVideosQuery.range.split('-')
      videos = videos.andWhere('viewCount >= :min', { min: range[0] })
      videos = videos.andWhere('viewCount <= :max', { max: range[1] })
    }
    if (getVideosQuery.filters !== undefined) {
      videos = videos.select(['video.id', ...getVideosQuery.filters.map(filter => 'video.' + filter)])
    }
    return await videos.getMany();
  }
}
