import { Table, Column, Model, BeforeCreate, HasMany } from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserRO } from './user.ro';
import { PostEntity } from '../posts/post.entity';
import { CommentEntity } from '../comments/comment.entity';

@Table
export class UserEntity extends Model<UserEntity> {
  @Column({ allowNull: false, unique: true })
  username: string;

  @BeforeCreate
  static async hashPassword(instance: UserEntity) {
    instance.password = await bcrypt.hash(instance.password, 10);
  }
  @Column({ allowNull: false })
  password: string;

  @HasMany(() => PostEntity)
  posts: PostEntity[];

  @HasMany(() => CommentEntity)
  comments: CommentEntity[];

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  toResponseObject(showToken: boolean = true): UserRO {
    const { id, username, token } = this;
    const responceObject: any = { id, username };
    if (showToken) {
      responceObject.token = token;
    }

    return responceObject;
  }

  private get token() {
    const { id, username } = this;
    return jwt.sign(
      {
        id,
        username,
      },
      'ThisIsASecretKey',
      { expiresIn: '7d' },
    );
  }
}