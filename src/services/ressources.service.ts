import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Region as RegionEntity } from '../entities/region.entity';
import { VideoCategory as VideoCategoryEntity } from '../entities/video_category.entity';
import { Video as VideoEntity } from '../entities/video.entity';

@Injectable()
export class RessourcesService {
  constructor(
    @InjectRepository(RegionEntity)
    private readonly regionRepository: Repository<RegionEntity>,
    @InjectRepository(VideoCategoryEntity)
    private readonly videoCategoryRepository: Repository<VideoCategoryEntity>,
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
  ) {}

  async getRessoucesByCountriesAndCategories(params) {
    const videos = await this.videoRepository.find({
      // join: {
      //   alias: 'video',
      //   leftJoinAndSelect: {
      //     region: 'video.regions',
      //     tags: 'video.tags',
      //   },
      // },
      where: {
        videoCategory: params.category,
        // regions: params.country,
      },
    });

    const averageTime = calculAverages(videos, 'duration');
    const averageViewCount = calculAverages(videos, 'viewCount');
    const likes = videos.reduce((current, next) => current + next.likeCount, 0);
    const dislikes = videos.reduce(
      (current, next) => current + next.dislikeCount,
      0,
    );
    const likePourcentage = (likes / (likes + dislikes)) * 100;
    const dislikePourcentage = (dislikes / (likes + dislikes)) * 100;
    const days = [
      'dimanche',
      'lundi',
      'mardi',
      'mercredi',
      'jeudi',
      'vendredi',
      'samedi',
    ];
    const numberOfPublicationByDate = days.map((day, i) => {
      const matchThisDay = video => {
        const date = new Date(video.publishedAt);
        const videoDay = date.getDay();

        return videoDay === i;
      };
      const numberOfPublication = videos.filter(matchThisDay).length;

      return {
        [day]: numberOfPublication,
      };
    });

    const bestTimeOfPublication = getBestTimeOfPublication(videos);

    return {
      videos,
      averageTime: Math.round(averageTime),
      averageViewCount: Math.round(averageViewCount),
      likePourcentage: Math.round(likePourcentage),
      dislikePourcentage: Math.round(dislikePourcentage),
      numberOfPublicationByDate,
      bestTimeOfPublication,
    };
  }
}

function calculAverages(tabOfValue, objectKey = null) {
  if (objectKey) {
    return (
      tabOfValue.reduce((current, next) => current + next[objectKey], 0) /
      tabOfValue.length
    );
  }
  return (
    tabOfValue.reduce((current, next) => current + next, 0) / tabOfValue.length
  );
}

function hourRanges() {
  const hours = [];
  let hour = 24;

  for (let i = 0; i < 24; i++) {
    hours.push(i);
  }

  return hours;
}

function getBestTimeOfPublication(videos) {
  const TimeOfPublicationByRange = hourRanges()
    .map(hour => {
      let numberOfPublication = [];
      const start = new Date(0);
      const middle = new Date(0);
      const end = new Date(0);

      start.setHours(hour, 0, 0);
      middle.setHours(hour, 30, 0);
      end.setHours(hour + 1, 0, 0);

      numberOfPublication.push({
        range: `${hour}:00 - ${hour}:30`,
        value: filterVideoByTimeRange(videos, { start, end: middle }).length,
      });
      numberOfPublication.push({
        range: `${hour}:30 - ${hour + 1}:00`,
        value: filterVideoByTimeRange(videos, { start: middle, end }).length,
      });

      return numberOfPublication;
    })
    .flat();

  const max = Math.max(...TimeOfPublicationByRange.map(range => range.value));

  return TimeOfPublicationByRange.find(range => range.value === max);
}

function filterVideoByTimeRange(videos, { start, end }) {
  return videos.filter(video => {
    const date = new Date(video.publishedAt);
    date.setDate(1);
    date.setMonth(0);
    date.setFullYear(1970);

    return date >= start && date <= end;
  });
}
