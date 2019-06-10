import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { PostModule } from './posts/post.module';
import { CommentModule } from './comments/comment.module';
import { HashtagModule } from './hashtags/hashtag.module';
import { HashtagAndPostModule } from './hashtags-and-posts/hashtag-and-post.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.register({
      dest: './uploads',
    }),
    UserModule,
    PostModule,
    CommentModule,
    HashtagModule,
    HashtagAndPostModule,
  ],
})
export class AppModule {}
