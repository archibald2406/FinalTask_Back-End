import { CommentEntity } from './comment.entity';

export const commentProviders = [
  {
    provide: 'COMMENTS_REPOSITORY',
    useValue: CommentEntity,
  },
];