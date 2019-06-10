import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { hashtagProviders } from './hashtag.providers';
import { HashtagsController } from './hashtag.controller';
import { HashtagService } from './hashtag.service';
import { hashtagAndPostProviders } from '../hashtags-and-posts/hashtag-and-post.providers';
import { postProviders } from '../posts/post.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [HashtagsController],
  providers: [HashtagService, ...hashtagProviders, ...postProviders, ...hashtagAndPostProviders],
})
export class HashtagModule {}
