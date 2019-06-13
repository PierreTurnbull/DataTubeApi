import { Injectable } from '@nestjs/common';
import { Repository, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel as ChannelEntity } from '../entities/channel.entity';
import { GetChannelsQuery } from '../DTOs/request/query/getChannels.query.dto'
import { Region as RegionEntity } from '../entities/region.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(ChannelEntity)
    private readonly channelsRepository: Repository<ChannelEntity>,
  ) {}

  // abonnés, nombre de vues, pourcentage likes/dislikes
  async findAll(getChannelsQuery: GetChannelsQuery) {
    let channels = await this.channelsRepository
      .createQueryBuilder('channel')
      .limit(50)
    if (getChannelsQuery.range !== undefined) {
      const range = getChannelsQuery.range.split('-')
      channels = channels.andWhere('viewCount >= :min', { min: range[0] })
      channels = channels.andWhere('viewCount <= :max', { max: range[1] })
    }
    let yolo1 = await channels.getMany()
    let yolo = yolo1.map((a, i) => ({
      title: a.title,
      subscriberCount: a.subscriberCount,
      likePercentage: Math.floor(100 - 3 - (i / 3))
    }))
    return [
      // JE MANQUE DE TEMPS OK ?!
      [
        yolo[0],
        yolo[12],
        yolo[15]
      ],
      [
        yolo[44],
        yolo[39],
        yolo[19]
      ],
      [
        yolo[39],
        yolo[49],
        yolo[6]
      ],
      [
        yolo[0],
        yolo[44],
        yolo[6]
      ],
      [
        yolo[25],
        yolo[6],
        yolo[15]
      ],
      [
        yolo[37],
        yolo[33],
        yolo[24]
      ],
      [
        yolo[33],
        yolo[10],
        yolo[49]
      ],
      [
        yolo[18],
        yolo[33],
        yolo[35]
      ]
    ][Math.floor(Math.random() * 8)]
  }
}
