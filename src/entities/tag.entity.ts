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

@Entity('tag', { schema: 'data_tube' })
export class Tag {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id: number;

  @Column('varchar', {
    nullable: false,
    length: 500,
    name: 'value',
  })
  value: string;

  @ManyToMany(type => Video, video => video.tags)
  videos: Video[];
}
