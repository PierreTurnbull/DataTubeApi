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
import { Thumbnail } from './thumbnail.entity';
import { Video } from './video.entity';

@Entity('playlist', { schema: 'data_tube' })
@Index('fk_playlist_channel1_idx', ['channel'])
export class Playlist {
  @Column('varchar', {
    nullable: false,
    primary: true,
    length: 64,
    name: 'id',
  })
  id: string;

  @Column('datetime', {
    nullable: false,
    name: 'published_at',
  })
  publishedAt: Date;

  @Column('varchar', {
    nullable: false,
    length: 64,
    name: 'title',
  })
  title: string;

  @Column('varchar', {
    nullable: true,
    length: 3000,
    name: 'description',
  })
  description: string | null;

  @ManyToOne(type => Channel, channel => channel.playlists, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'channel_id' })
  channel: Channel | null;

  @OneToMany(type => Thumbnail, thumbnail => thumbnail.playlist, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  thumbnails: Thumbnail[];

  @ManyToMany(type => Video, video => video.playlists, { nullable: false })
  @JoinTable({ name: 'playlist_has_video' })
  videos: Video[];
}
