import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { HashtagAndPostEntity } from '../hashtags-and-posts/hashtag-and-post.entity';

@Table
export class HashtagEntity extends Model<HashtagEntity> {
  @Column({ allowNull: false })
  title: string;

  @HasMany(() => HashtagAndPostEntity)
  hashtagsAndPosts: HashtagAndPostEntity[];
}