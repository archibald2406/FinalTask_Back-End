import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import moment = require('moment');
import { CommentEntity } from './comment.entity';
import { PostEntity } from '../posts/post.entity';
import { CommentDto } from './comment.dto';
import { CommentRO } from './comment.ro';
import { UserEntity } from '../user/user.entity';
import * as fs from 'fs';

@Injectable()
export class CommentService {
  constructor(@Inject('COMMENTS_REPOSITORY') private commentsRepository: typeof CommentEntity,
              @Inject('POSTS_REPOSITORY') private postsRepository: typeof PostEntity,
              @Inject('USERS_REPOSITORY') private usersRepository: typeof UserEntity) { }

  async findAllComments(query: any): Promise<CommentRO[]> {
    return await this.commentsRepository.findAll<CommentEntity>({
      limit: parseInt(query.limit, 10) || 1000,
      offset: parseInt(query.offset, 10) || 0,
    });
  }

  async findCommentByPostId(id: number) {
    const post = await this.postsRepository.findAll<PostEntity>({
      where: { id },
      include: [{
        model: CommentEntity,
        where: { postId: id },
      }],
    });
    if (!post.length) {
      throw new HttpException('This post has no comments or post does not exists', HttpStatus.NOT_FOUND);
    }
    return post;
  }

  async findCommentByUserId(id: number): Promise<CommentRO[]> {
    const comments = await this.commentsRepository.findAll<CommentEntity>({
      where: { userId: id },
    });
    if (!comments.length) {
      throw new HttpException('Comments of such user not found', HttpStatus.NOT_FOUND);
    }
    return comments;
  }

  async findCommentById(id: number): Promise<CommentRO> {
    const comment = await this.commentsRepository.findByPk<CommentEntity>(id);
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    return comment;
  }

  async createComment(postId: string, userId: string, comment: CommentDto): Promise<CommentRO> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (post) {
      return await this.commentsRepository.create({
        content: comment.content,
        created: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        updated: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        userId,
        postId,
      });
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  public async addImage(id: number, userId: string, image: any): Promise<number> {
    if (!/^image/.test(image.mimetype)) {
      throw new HttpException('Wrong format. File must have image type', HttpStatus.BAD_REQUEST);
    }
    const comment = await this.commentsRepository.findByPk<CommentEntity>(id);
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(comment, userId);
    fs.writeFileSync(`uploads/${image.originalname}`, image.buffer, 'base64');
    const updatedComment = await this.commentsRepository.update({
      image: image.originalname,
      updated: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    }, { where: { id } });
    return updatedComment[0];
  }

  public async getImage(id: number, userId: string): Promise<string> {
    const comment = await this.commentsRepository.findByPk<CommentEntity>(id);
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(comment, userId);
    return comment.image;
  }

  async deleteComment(id: number, userId: string): Promise<number> {
    const comment = await this.commentsRepository.findByPk<CommentEntity>(id);
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnership(comment, userId);
    return await this.commentsRepository.destroy({ where: { id } });
  }

  private ensureOwnership(comment: CommentEntity, userId: string) {
    if (comment.userId !== parseInt(userId, 10)) {
      throw new HttpException('You do not own this comment', HttpStatus.UNAUTHORIZED);
    }
  }
}