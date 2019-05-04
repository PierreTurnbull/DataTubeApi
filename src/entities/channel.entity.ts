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
import { Playlist } from './playlist.entity';
import { Thumbnail } from './thumbnail.entity';
import { Video } from './video.entity';

@Entity('channel', { schema: 'data_tube' })
export class Channel {
  @Column('varchar', {
    nullable: false,
    primary: true,
    length: 64,
    name: 'id',
  })
  id: string;

  @Column('varchar', {
    nullable: false,
    length: 1000,
    name: 'title',
  })
  title: string;

  @Column('varchar', {
    nullable: true,
    length: 1000,
    name: 'description',
  })
  description: string | null;

  @Column('varchar', {
    nullable: false,
    length: 45,
    name: 'published_at',
  })
  publishedAt: string;

  @Column('int', {
    nullable: true,
    name: 'subscriber_count',
  })
  subscriberCount: number | null;

  @OneToMany(type => Playlist, playlist => playlist.channel, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  playlists: Playlist[];

  @OneToMany(type => Thumbnail, thumbnail => thumbnail.channel, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  thumbnails: Thumbnail[];

  @OneToMany(type => Video, video => video.channel, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  videos: Video[];
}
