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

@Entity('language', { schema: 'data_tube' })
export class Language {
  @Column('varchar', {
    nullable: false,
    primary: true,
    length: 16,
    name: 'id',
  })
  id: string;

  @Column('varchar', {
    nullable: false,
    length: 2,
    name: 'code',
  })
  code: string;

  @Column('varchar', {
    nullable: false,
    length: 64,
    name: 'name',
  })
  name: string;

  @OneToMany(type => Video, video => video.language, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  videos: Video[];
}
