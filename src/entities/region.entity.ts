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
import { VideoCategory } from './videoCategory.entity';
import { Video } from './video.entity';

@Entity('region', { schema: 'data_tube' })
export class Region {
  @Column('varchar', {
    nullable: false,
    primary: true,
    length: 2,
    name: 'id',
  })
  id: string;

  @Column('varchar', {
    nullable: false,
    length: 64,
    name: 'name',
  })
  name: string;

  @ManyToMany(type => VideoCategory, videoCategory => videoCategory.regions)
  videoCategories: VideoCategory[];

  @ManyToMany(type => Video, video => video.regions)
  videos: Video[];
}
