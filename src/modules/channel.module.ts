import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel as ChannelEntity } from '../entities/channel.entity';
import { ChannelService } from '../services/channel.service';
import { ChannelController } from '../controllers/channel.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelEntity])],
  providers: [ChannelService],
  controllers: [ChannelController],
})
export class ChannelModule {}
