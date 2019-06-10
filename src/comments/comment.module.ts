import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { commentProviders } from './comment.providers';
import { postProviders } from '../posts/post.providers';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { usersProviders } from '../user/user.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [CommentController],
  providers: [CommentService, ...commentProviders, ...postProviders, ...usersProviders],
})
export class CommentModule {}
