import {
  Controller,
  Response,
  Body,
  Post,
  Get,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '../shared/auth.guard';
import { HashtagService } from './hashtag.service';
import { HashtagDto } from './hashtag.dto';

@Controller('hashtags')
export class HashtagsController {
  constructor(private hashtagService: HashtagService) {}

  @Get()
  public async getAll(@Response() res, @Query() query) {
    const hashtags = await this.hashtagService.findAllHashtags(query);
    return res.status(HttpStatus.OK).json(hashtags);
  }

  @Get('/:id')
  public async get(@Response() res, @Param('id') id) {
    const hashtag = await this.hashtagService.findHashtagById(id);
    return res.status(HttpStatus.OK).json(hashtag);
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  public async create(@Response() res, @Body() body: HashtagDto) {
    const hashtag = await this.hashtagService.createHashtag(body);
    return res.status(HttpStatus.OK).json(hashtag);
  }

  @Put('/:id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  public async update(@Response() res, @Body() body: HashtagDto, @Param('id') id) {
    const hashtag = await this.hashtagService.updateHashtag(id, body);
    return res.status(HttpStatus.OK).json(hashtag);
  }

  @Delete('/:id')
  @UseGuards(new AuthGuard())
  public async delete(@Response() res, @Param('id') id) {
    const hashtag = await this.hashtagService.deleteHashtag(id);
    return res.status(HttpStatus.OK).json(hashtag);
  }

  @Post('/:hashtagId/post/:postId')
  @UseGuards(new AuthGuard())
  public async bindTagWithPost(@Response() res, @Param('hashtagId') hashtagId, @Param('postId') postId) {
    const hashtagAndPost = await this.hashtagService.bindTagWithPost(hashtagId, postId);
    return res.status(HttpStatus.OK).json(hashtagAndPost);
  }

  @Delete('/:hashtagId/post/:postId')
  @UseGuards(new AuthGuard())
  public async removeTagFromPost(@Response() res, @Param('hashtagId') hashtagId, @Param('postId') postId) {
    const hashtagAndPost = await this.hashtagService.removeTagFromPost(hashtagId, postId);
    return res.status(HttpStatus.OK).json(hashtagAndPost);
  }

  @Get('/:id/posts')
  public async getPostsByTag(@Response() res, @Param('id') id) {
    const posts = await this.hashtagService.getPostsByTag(id);
    return res.status(HttpStatus.OK).json(posts);
  }
}