import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PostEntity } from './post.entity';
import { UserEntity } from '../user/user.entity';
import { PostRO } from './post.ro';
import { PostDto } from './post.dto';
import moment = require('moment');
import * as fs from 'fs';
import { HashtagEntity } from '../hashtags/hashtag.entity';
import { HashtagAndPostEntity } from '../hashtags-and-posts/hashtag-and-post.entity';

@Injectable()
export class PostService {
  constructor(@Inject('POSTS_REPOSITORY') private postsRepository: typeof PostEntity,
              @Inject('HASHTAGS_REPOSITORY') private hashtagsRepository: typeof HashtagEntity,
              @Inject('USERS_REPOSITORY') private userRepository: typeof UserEntity) { }

  async findAllPosts(query: any): Promise<PostRO[]> {
    return await this.postsRepository.findAll<PostEntity>({
      limit: parseInt(query.limit, 10) || 1000,
      offset: parseInt(query.offset, 10) || 0,
    });
  }

  async findPostById(id: number): Promise<PostRO> {
    const post = await this.postsRepository.findByPk<PostEntity>(id);
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return post;
  }

  async getTagsByPost(id: number): Promise<any> {
    const post = await this.postsRepository.findByPk<PostEntity>(id);
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return await this.hashtagsRepository.findAll({
      include: [{
        model: HashtagAndPostEntity,
        where: { postId: id },
      }],
    });
  }

  async createPost(userId: string, post: PostDto): Promise<PostRO> {
    return await this.postsRepository.create({
      content: post.content,
      created: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      updated: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      userId,
    });
  }

  public async addImage(id: number, userId: string, image: any): Promise<number> {
    if (!/^image/.test(image.mimetype)) {
      throw new HttpException('Wrong format. File must have image type', HttpStatus.BAD_REQUEST);
    }
    const post = await this.postsRepository.findByPk<PostEntity>(id);
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(post, userId);
    fs.writeFileSync(`uploads/${image.originalname}`, image.buffer, 'base64');
    const updatedPost = await this.postsRepository.update({
      image: image.originalname,
      updated: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    }, { where: { id } });
    return updatedPost[0];
  }

  public async getImage(id: number, userId: string): Promise<string> {
    const post = await this.postsRepository.findByPk<PostEntity>(id);
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(post, userId);
    return post.image;
  }

  async updatePost(id: number, userId: string, newPost: PostDto): Promise<number> {
    const post = await this.postsRepository.findByPk<PostEntity>(id);
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(post, userId);
    const updatedPost = await this.postsRepository.update({
      content: newPost.content,
      updated: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    }, { where: { id } });
    return updatedPost[0];
  }

  async deletePost(id: number, userId: string): Promise<number> {
    const post = await this.postsRepository.findByPk<PostEntity>(id);
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(post, userId);
    return await this.postsRepository.destroy({ where: { id } });
  }

  private ensureOwnership(post: PostEntity, userId: string) {
    if (post.userId !== parseInt(userId, 10)) {
      throw new HttpException('Incorrect user', HttpStatus.UNAUTHORIZED);
    }
  }
}