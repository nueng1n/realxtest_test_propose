import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from './User';
import { Tag } from './Tag';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  post_id: number;

  @Column({ type: 'text' })
  post_title: string;

  @Column({ type: 'text' })
  post_content: string;

  @Column({ type: 'timestamptz' })
  post_at: Date;

  @ManyToOne(() => User, user => user.posts)
  user: User;

  @ManyToMany(() => Tag, tag => tag.posts)
  @JoinTable({
    name: 'post_tags',
    joinColumn: { name: 'post_id', referencedColumnName: 'post_id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'tag_id' }
  })
  tags: Tag[];
}



