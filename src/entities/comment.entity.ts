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
@Index('fk_comment_video1_idx', ['video'])
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
    name: 'published_at',
  })
  publishedAt: Date;

  @ManyToOne(type => Video, video => video.comments, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'video_id' })
  video: Video | null;
}
