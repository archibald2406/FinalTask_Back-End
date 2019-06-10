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
  UploadedFile,
  UseInterceptors,
  Res,
  HttpException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '../shared/auth.guard';
import { User } from '../user/user.decorator';
import { PostDto } from './post.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostService) {}

  @Get()
  public async getAll(@Response() res, @Query() query) {
    const posts = await this.postService.findAllPosts(query);
    return res.status(HttpStatus.OK).json(posts);
  }

  @Get('/:id')
  public async get(@Response() res, @Param('id') id) {
    const post = await this.postService.findPostById(id);
    return res.status(HttpStatus.OK).json(post);
  }

  @Get('/:id/hashtags')
  public async getHashtagsByPost(@Response() res, @Param('id') id) {
    const hashtags = await this.postService.getTagsByPost(id);
    return res.status(HttpStatus.OK).json(hashtags);
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  public async create(@User('id') user, @Response() res, @Body() body: PostDto) {
    const post = await this.postService.createPost(user, body);
    return res.status(HttpStatus.OK).json(post);
  }

  @Put('/:id/image')
  @UseGuards(new AuthGuard())
  @UseInterceptors(FileInterceptor('image'))
  public async addPicture(@UploadedFile() file, @User('id') user, @Param('id') id, @Response() res) {
    const image = await this.postService.addImage(id, user, file);
    return res.status(HttpStatus.OK).json(image);
  }

  @Get('/:id/image')
  @UseGuards(new AuthGuard())
  public async getPicture(@User('id') user, @Param('id') id, @Res() res) {
    const imagePath = await this.postService.getImage(id, user);
    if (!imagePath) {
      throw new HttpException('Post dont have image', HttpStatus.NOT_FOUND);
    }
    return res.sendFile(imagePath, { root: 'uploads' });
  }

  @Put('/:id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  public async update(@Response() res, @Body() body: PostDto, @User('id') user, @Param('id') id) {
    const post = await this.postService.updatePost(id, user, body);
    return res.status(HttpStatus.OK).json(post);
  }

  @Delete('/:id')
  @UseGuards(new AuthGuard())
  public async delete(@Response() res, @User('id') user, @Param('id') id) {
    const post = await this.postService.deletePost(id, user);
    return res.status(HttpStatus.OK).json(post);
  }
}