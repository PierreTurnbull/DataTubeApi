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
import { Language } from './language.entity';
import { VideoCategory } from './video_category.entity';
import { Channel } from './channel.entity';
import { Comment } from './comment.entity';
import { Thumbnail } from './thumbnail.entity';
import { Playlist } from './playlist.entity';
import { Tag } from './tag.entity';

@Entity('video', { schema: 'data_tube' })
@Index('fk_video_language1_idx', ['language'])
@Index('fk_video_video_category1_idx', ['videoCategory'])
@Index('fk_video_channel1_idx', ['channel'])
export class Video {
  @Column('varchar', {
    nullable: false,
    primary: true,
    length: 64,
    name: 'id',
  })
  id: string;

  @Column('varchar', {
    nullable: false,
    length: 128,
    name: 'title',
  })
  title: string;

  @Column('varchar', {
    nullable: false,
    length: 3000,
    name: 'description',
  })
  description: string;

  @Column('datetime', {
    nullable: false,
    name: 'published_at',
  })
  publishedAt: Date;

  @Column('int', {
    nullable: false,
    name: 'duration',
  })
  duration: number;

  @Column('int', {
    nullable: false,
    name: 'view_count',
  })
  viewCount: number;

  @Column('int', {
    nullable: false,
    name: 'like_count',
  })
  likeCount: number;

  @Column('int', {
    nullable: false,
    name: 'dislike_count',
  })
  dislikeCount: number;

  @Column('int', {
    nullable: false,
    name: 'comment_count',
  })
  commentCount: number;

  @Column('varchar', {
    nullable: false,
    length: 2,
    name: 'definition',
  })
  definition: string;

  @Column('tinyint', {
    nullable: false,
    width: 1,
    name: 'has_caption',
  })
  hasCaption: boolean;

  @Column('tinyint', {
    nullable: false,
    width: 1,
    name: 'is_licensed',
  })
  isLicensed: boolean;

  @ManyToOne(type => Language, language => language.videos, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'language_id' })
  language: Language | null;

  @ManyToOne(type => VideoCategory, video_category => video_category.videos, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'video_category_id' })
  videoCategory: VideoCategory | null;

  @ManyToOne(type => Channel, channel => channel.videos, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'channel_id' })
  channel: Channel | null;

  @OneToMany(type => Comment, comment => comment.video, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  comments: Comment[];

  @OneToMany(type => Thumbnail, thumbnail => thumbnail.video, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  thumbnails: Thumbnail[];

  @ManyToMany(type => Playlist, playlist => playlist.videos)
  playlists: Playlist[];

  @ManyToMany(type => Tag, tag => tag.videos, { nullable: false })
  @JoinTable({ name: 'video_has_tag' })
  tags: Tag[];
}
