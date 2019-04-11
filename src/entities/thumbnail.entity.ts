import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Channel } from './channel.entity';
import { Playlist } from './playlist.entity';
import { Video } from './video.entity';

@Entity('thumbnail', { schema: 'data_tube' })
@Index('fk_thumbnail_channel1_idx', ['channel'])
@Index('fk_thumbnail_playlist1_idx', ['playlist'])
@Index('fk_thumbnail_video1_idx', ['video'])
export class Thumbnail {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id: number;

  @Column('varchar', {
    nullable: false,
    length: 64,
    name: 'url',
  })
  url: string;

  @Column('varchar', {
    nullable: false,
    length: 16,
    name: 'size',
  })
  size: string;

  @Column('int', {
    nullable: false,
    name: 'width',
  })
  width: number;

  @Column('int', {
    nullable: false,
    name: 'height',
  })
  height: number;

  @ManyToOne(type => Channel, channel => channel.thumbnails, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'channel_id' })
  channel: Channel | null;

  @ManyToOne(type => Playlist, playlist => playlist.thumbnails, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'playlist_id' })
  playlist: Playlist | null;

  @ManyToOne(type => Video, video => video.thumbnails, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'video_id' })
  video: Video | null;
}
