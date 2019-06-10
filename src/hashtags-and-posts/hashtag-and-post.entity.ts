import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { PostEntity } from '../posts/post.entity';
import { HashtagEntity } from '../hashtags/hashtag.entity';

@Table
export class HashtagAndPostEntity extends Model<HashtagAndPostEntity> {
  @ForeignKey(() => HashtagEntity)
  @Column
  hashtagId: number;

  @ForeignKey(() => PostEntity)
  @Column
  postId: number;

  @BelongsTo(() => HashtagEntity)
  hashtag: HashtagEntity;

  @BelongsTo(() => PostEntity)
  post: PostEntity;
}