import { Table, Column, Model, HasMany, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { UserEntity } from '../user/user.entity';
import { CommentEntity } from '../comments/comment.entity';
import { HashtagAndPostEntity } from '../hashtags-and-posts/hashtag-and-post.entity';

@Table
export class PostEntity extends Model<PostEntity> {
  @Column(DataType.TEXT)
  content: string;

  @Column
  created: Date;

  @Column
  updated: Date;

  @Column({defaultValue: ''})
  image: string;

  @ForeignKey(() => UserEntity)
  @Column
  userId: number;

  @BelongsTo(() => UserEntity)
  user: UserEntity;

  @HasMany(() => CommentEntity)
  comments: CommentEntity[];

  @HasMany(() => HashtagAndPostEntity)
  hashtagsAndPosts: HashtagAndPostEntity[];
}