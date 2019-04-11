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
import { VideoCategory } from './video_category.entity';

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

  @ManyToMany(type => VideoCategory, video_category => video_category.regions)
  videoCategories: VideoCategory[];
}
