import { Sequelize } from 'sequelize-typescript';
import { UserEntity } from '../user/user.entity';
import { PostEntity } from '../posts/post.entity';
import { CommentEntity } from '../comments/comment.entity';
import { HashtagEntity } from '../hashtags/hashtag.entity';
import { HashtagAndPostEntity } from '../hashtags-and-posts/hashtag-and-post.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        timezone : '+03:00',
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'pass123',
        database: 'twitter_app',
      });
      sequelize.addModels([
        UserEntity,
        PostEntity,
        CommentEntity,
        HashtagEntity,
        HashtagAndPostEntity,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];