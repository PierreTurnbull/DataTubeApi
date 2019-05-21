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
import { VideoCategory } from './videoCategory.entity';
import { Channel } from './channel.entity';
import { Comment } from './comment.entity';
import { Thumbnail } from './thumbnail.entity';
import { Playlist } from './playlist.entity';
import { Tag } from './tag.entity';
import { Region } from './region.entity';

@Entity('video', { schema: 'data_tube' })
@Index('fkVideoLanguage1Idx', ['language'])
@Index('fkVideoVideoCategory1Idx', ['videoCategory'])
@Index('fkVideoChannel1Idx', ['channel'])
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
    name: 'publishedAt',
  })
  publishedAt: Date;

  @Column('int', {
    nullable: false,
    name: 'duration',
  })
  duration: number;

  @Column('int', {
    nullable: true,
    name: 'viewCount',
  })
  viewCount: number | null;

  @Column('int', {
    nullable: true,
    name: 'likeCount',
  })
  likeCount: number | null;

  @Column('int', {
    nullable: true,
    name: 'dislikeCount',
  })
  dislikeCount: number | null;

  @Column('int', {
    nullable: true,
    name: 'commentCount',
  })
  commentCount: number | null;

  @Column('varchar', {
    nullable: false,
    length: 2,
    name: 'definition',
  })
  definition: string;

  @Column('tinyint', {
    nullable: false,
    width: 1,
    name: 'hasCaption',
  })
  hasCaption: boolean;

  @Column('tinyint', {
    nullable: false,
    width: 1,
    name: 'isLicensed',
  })
  isLicensed: boolean;

  @ManyToOne(type => Language, language => language.videos, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'languageId' })
  language: Language | null;

  @ManyToOne(type => VideoCategory, videoCategory => videoCategory.videos, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'videoCategoryId' })
  videoCategory: VideoCategory | null;

  @ManyToOne(type => Channel, channel => channel.videos, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'channelId' })
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
  @JoinTable({ name: 'videoHasTag' })
  tags: Tag[];

  @ManyToMany(type => Region, region => region.videos, { nullable: false })
  @JoinTable({ name: 'videoIsPopularInRegion' })
  regions: Region[];
}
