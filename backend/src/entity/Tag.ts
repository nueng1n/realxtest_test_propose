import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Unique } from 'typeorm';
import { Post } from './Post';

@Entity('tags')
@Unique(['tag_name'])
export class Tag {
  @PrimaryGeneratedColumn()
  tag_id: number;

  @Column({ type: 'varchar', length: 255 })
  tag_name: string;

  @ManyToMany(() => Post, post => post.tags)
  posts: Post[];
}
