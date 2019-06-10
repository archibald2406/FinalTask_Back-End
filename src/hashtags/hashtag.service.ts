import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { HashtagEntity } from './hashtag.entity';
import { HashtagRO } from './hashtag.ro';
import { HashtagDto } from './hashtag.dto';
import { HashtagAndPostEntity } from '../hashtags-and-posts/hashtag-and-post.entity';
import { HashtagAndPostRO } from '../hashtags-and-posts/hashtag-and-post.ro';
import { PostEntity } from '../posts/post.entity';

@Injectable()
export class HashtagService {
  constructor(@Inject('HASHTAGS_REPOSITORY') private hashtagsRepository: typeof HashtagEntity,
              @Inject('POSTS_REPOSITORY') private postsRepository: typeof PostEntity,
              @Inject('HASHTAGS_AND_POSTS_REPOSITORY') private hashtagAndPostRepository: typeof HashtagAndPostEntity) { }

  async findAllHashtags(query: any): Promise<HashtagRO[]> {
    return await this.hashtagsRepository.findAll<HashtagEntity>({
      limit: parseInt(query.limit, 10) || 1000,
      offset: parseInt(query.offset, 10) || 0,
    });
  }

  async findHashtagById(id: number): Promise<HashtagRO> {
    const hashtag = await this.hashtagsRepository.findByPk<HashtagEntity>(id);
    if (!hashtag) {
      throw new HttpException('Hashtag not found', HttpStatus.NOT_FOUND);
    }
    return hashtag;
  }

  async createHashtag(hashtag: HashtagDto): Promise<HashtagRO> {
    return await this.hashtagsRepository.create({
      title: hashtag.title,
    });
  }

  async updateHashtag(id: number, newPost: HashtagDto): Promise<number> {
    const hashtag = await this.hashtagsRepository.findByPk<HashtagEntity>(id);
    if (!hashtag) {
      throw new HttpException('Hashtag not found', HttpStatus.NOT_FOUND);
    }
    const updatedHashtag = await this.hashtagsRepository.update({
      title: newPost.title,
    }, { where: { id } });
    return updatedHashtag[0];
  }

  async deleteHashtag(id: number): Promise<number> {
    const hashtag = await this.hashtagsRepository.findByPk<HashtagEntity>(id);
    if (!hashtag) {
      throw new HttpException('Hashtag not found', HttpStatus.NOT_FOUND);
    }
    return await this.hashtagsRepository.destroy({ where: { id } });
  }

  async bindTagWithPost(hashtagId: number, postId: number): Promise<HashtagAndPostRO> {
    const hashtag = await this.hashtagsRepository.findByPk<HashtagEntity>(hashtagId);
    const post = await this.postsRepository.findByPk<PostEntity>(postId);
    if (!hashtag || !post) {
      throw new HttpException('Hashtag or post not found', HttpStatus.NOT_FOUND);
    }
    const hashtagAndPostRecord = await this.hashtagAndPostRepository.findAll<HashtagAndPostEntity>({
      where: { hashtagId, postId },
    });
    if (hashtagAndPostRecord.length) {
      throw new HttpException('Hashtag and post already binded', HttpStatus.CONFLICT);
    }
    return await this.hashtagAndPostRepository.create<HashtagAndPostEntity>({
      hashtagId, postId,
    });
  }

  async removeTagFromPost(hashtagId: number, postId: number): Promise<number> {
    const hashtag = await this.hashtagsRepository.findByPk<HashtagEntity>(hashtagId);
    const post = await this.postsRepository.findByPk<PostEntity>(postId);
    if (!hashtag || !post) {
      throw new HttpException('Hashtag or post not found', HttpStatus.NOT_FOUND);
    }
    const hashtagAndPostRecord = await this.hashtagAndPostRepository.findAll<HashtagAndPostEntity>({
      where: { hashtagId, postId },
    });
    if (!hashtagAndPostRecord.length) {
      throw new HttpException('Hashtag and post are not connected', HttpStatus.NOT_FOUND);
    }
    return await this.hashtagAndPostRepository.destroy({ where: { hashtagId, postId } });
  }

  async getPostsByTag(id: number): Promise<any> {
    const hashtag = await this.hashtagsRepository.findByPk<HashtagEntity>(id);
    if (!hashtag) {
      throw new HttpException('Hashtag not found', HttpStatus.NOT_FOUND);
    }
    return await this.postsRepository.findAll({
      include: [{
        model: HashtagAndPostEntity,
        where: { hashtagId: id },
      }],
    });
  }
}