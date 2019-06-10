import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { UserEntity } from '../user/user.entity';
import { PostEntity } from '../posts/post.entity';

@Table
export class CommentEntity extends Model<CommentEntity> {
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

  @ForeignKey(() => PostEntity)
  @Column
  postId: number;

  @BelongsTo(() => UserEntity)
  user: UserEntity;

  @BelongsTo(() => PostEntity)
  post: PostEntity;
}