import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Video as VideoEntity } from '../entities/video.entity';
import { Tag as TagEntity } from '../entities/tag.entity';

@Injectable()
export class RessourcesService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async getRessoucesByCountriesAndCategories(params: {
    country: string;
    category: number;
  }) {
    const videos = await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.regions', 'region')
      .leftJoinAndSelect('video.videoCategory', 'videoCategory')
      .where('videoCategory.id = :category', {
        category: params.category,
      })
      .andWhere('region.id = :country', {
        country: params.country,
      })
      .getMany();

    const bestTags = await this.tagRepository
      .createQueryBuilder('tag')
      .addSelect('COUNT(tag.id)', 'nbTag')
      .innerJoin('tag.videos', 'video')
      .innerJoin('video.regions', 'region')
      .innerJoin('video.videoCategory', 'videoCategory')
      .where('videoCategory.id = :category', {
        category: params.category,
      })
      .andWhere('region.id = :country', {
        country: params.country,
      })
      .groupBy('tag.id')
      .orderBy('nbTag', 'DESC')
      .limit(3)
      .getMany();

    const averageTime = Math.round(calculAverages(videos, 'duration'));
    const averageViewCount = Math.round(calculAverages(videos, 'viewCount'));
    const likes = videos.reduce((current, next) => current + next.likeCount, 0);
    const dislikes = videos.reduce(
      (current, next) => current + next.dislikeCount,
      0,
    );
    const likePourcentage = Math.round((likes / (likes + dislikes)) * 100);
    const dislikePourcentage = Math.round(
      (dislikes / (likes + dislikes)) * 100,
    );
    const days = [
      'dimanche',
      'lundi',
      'mardi',
      'mercredi',
      'jeudi',
      'vendredi',
      'samedi',
    ];
    const numberOfPublicationByDay = days.map((day, i) => {
      const matchThisDay = (video: { publishedAt: string | number | Date }) => {
        const date = new Date(video.publishedAt);
        const videoDay = date.getDay();

        return videoDay === i;
      };
      const numberOfPublication = videos.filter(matchThisDay).length;

      return {
        label: day,
        value: numberOfPublication,
      };
    });
    const bestNumberOfPublication = getBestValue(numberOfPublicationByDay);
    const timeOfPublication = getTimeOfPublication(videos);
    const bestTimeOfPublication = getBestValue(timeOfPublication);

    return {
      videos,
      averageTime,
      averageViewCount,
      likePourcentage,
      dislikePourcentage,
      numberOfPublicationByDay,
      bestNumberOfPublication,
      timeOfPublication,
      bestTimeOfPublication,
      bestTags,
    };
  }
}

function calculAverages(tabOfValue: any[], objectKey: string = null) {
  if (objectKey) {
    return (
      tabOfValue.reduce(
        (current: number, next) => current + next[objectKey],
        0,
      ) / tabOfValue.length
    );
  }
  return (
    tabOfValue.reduce((current: number, next) => current + next, 0) /
    tabOfValue.length
  );
}

function hourRanges() {
  const hours = [];
  let hour = 24;

  for (let i = 0; i < 24; i++) {
    const start = new Date(0);
    const middle = new Date(0);
    const end = new Date(0);

    start.setHours(i, 0, 0);
    middle.setHours(i, 30, 0);
    end.setHours(i + 1, 0, 0);
    hours.push({
      start,
      middle,
      end,
    });
  }

  return hours;
}

function getTimeOfPublication(videos: any[]) {
  const timeOfPublicationByRange = hourRanges()
    .map(({ start, middle, end }) => {
      const numberOfPublication = [];

      numberOfPublication.push({
        label: `${start.getHours()}:00 - ${start.getHours()}:30`,
        value: filterVideoByTimeRange(videos, { start, end: middle }).length,
      });

      numberOfPublication.push({
        label: `${start.getHours()}:30 - ${start.getHours() + 1}:00`,
        value: filterVideoByTimeRange(videos, { start: middle, end }).length,
      });

      return numberOfPublication;
    })
    .flat();

  return timeOfPublicationByRange;
}

function getBestValue(array: { label: string; value: number }[]) {
  const max = Math.max(...array.map((item: { value: number }) => item.value));

  return array.find((item: { value: number }) => item.value === max);
}

function filterVideoByTimeRange(
  videos: any[],
  { start, end }: { start: any; end: any },
) {
  return videos.filter((video: { publishedAt: string | number | Date }) => {
    const date = new Date(video.publishedAt);
    date.setDate(1);
    date.setMonth(0);
    date.setFullYear(1970);

    return date >= start && date <= end;
  });
}
