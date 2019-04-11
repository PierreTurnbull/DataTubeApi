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
import { Video } from './video.entity';
import { Region } from './region.entity';

@Entity('video_category', { schema: 'data_tube' })
export class VideoCategory {
  @Column('int', {
    nullable: false,
    primary: true,
    name: 'id',
  })
  id: number;

  @Column('varchar', {
    nullable: false,
    length: 45,
    name: 'name',
  })
  name: string;

  @OneToMany(type => Video, video => video.videoCategory, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  videos: Video[];

  @ManyToMany(type => Region, region => region.videoCategories, {
    nullable: false,
  })
  @JoinTable({ name: 'video_category_has_region' })
  regions: Region[];
}
