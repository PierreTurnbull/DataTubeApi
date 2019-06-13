import { Controller, Get, Query } from '@nestjs/common';
import { ChannelService } from '../services/channel.service';
import { GetChannelsQuery } from '../DTOs/request/query/getChannels.query.dto'

@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  async findAll(@Query() getChannelsQuery: GetChannelsQuery) {
    return await this.channelService.findAll(getChannelsQuery);
  }
}
