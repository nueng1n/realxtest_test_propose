import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany, Unique } from 'typeorm';
import { Tag } from './Tag';
import { Post } from './Post';

@Entity('post_tags')
export class PostTag {
  @PrimaryColumn()
  post_id: number;

  @PrimaryColumn()
  tag_id: number;

  @ManyToOne(() => Post, post => post.tags)
  post: Post;

  @ManyToOne(() => Tag, tag => tag.posts)
  tag: Tag;

  @Column({ type: 'int' })
  index_order: number;
}