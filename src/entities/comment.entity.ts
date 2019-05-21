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

@Entity('comment', { schema: 'data_tube' })
@Index('fkCommentVideo1Idx', ['video'])
export class Comment {
  @Column('varchar', {
    nullable: false,
    primary: true,
    length: 128,
    name: 'id',
  })
  id: string;

  @Column('datetime', {
    nullable: false,
    name: 'publishedAt',
  })
  publishedAt: Date;

  @ManyToOne(type => Video, video => video.comments, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'videoId' })
  video: Video | null;
}
