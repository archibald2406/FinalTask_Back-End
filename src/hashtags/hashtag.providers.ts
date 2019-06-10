import { HashtagEntity } from './hashtag.entity';

export const hashtagProviders = [
  {
    provide: 'HASHTAGS_REPOSITORY',
    useValue: HashtagEntity,
  },
];