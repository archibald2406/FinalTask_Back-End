import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { postProviders } from './post.providers';
import { PostsController } from './post.controller';
import { PostService } from './post.service';
import { usersProviders } from '../user/user.providers';
import { hashtagProviders } from '../hashtags/hashtag.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [PostsController],
  providers: [PostService, ...postProviders, ...hashtagProviders, ...usersProviders],
})
export class PostModule {}
