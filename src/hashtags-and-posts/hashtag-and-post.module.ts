import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { hashtagAndPostProviders } from './hashtag-and-post.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [...hashtagAndPostProviders],
})
export class HashtagAndPostModule {}
