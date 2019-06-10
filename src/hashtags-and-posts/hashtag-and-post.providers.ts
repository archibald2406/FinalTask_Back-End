import { HashtagAndPostEntity } from './hashtag-and-post.entity';

export const hashtagAndPostProviders = [
  {
    provide: 'HASHTAGS_AND_POSTS_REPOSITORY',
    useValue: HashtagAndPostEntity,
  },
];