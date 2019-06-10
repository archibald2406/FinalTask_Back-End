import { PostEntity } from './post.entity';

export const postProviders = [
  {
    provide: 'POSTS_REPOSITORY',
    useValue: PostEntity,
  },
];