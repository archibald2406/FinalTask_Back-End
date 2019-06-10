import {
  Controller,
  Response,
  Body,
  Post,
  Get,
  HttpStatus,
  UsePipes,
  ValidationPipe, UseGuards, Query, Param, Put, Delete, UseInterceptors, UploadedFile, Res, HttpException,
} from '@nestjs/common';
import { AuthGuard } from '../shared/auth.guard';
import { User } from '../user/user.decorator';
import { CommentService } from './comment.service';
import { CommentDto } from './comment.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get()
  public async getAll(@Response() res, @Query() query) {
    const comments = await this.commentService.findAllComments(query);
    return res.status(HttpStatus.OK).json(comments);
  }

  @Get('/post/:id')
  public async getByPost(@Response() res, @Param('id') id) {
    const post = await this.commentService.findCommentByPostId(id);
    return res.status(HttpStatus.OK).json(post);
  }

  @Get('/user/:id')
  public async getByUser(@Response() res, @Param('id') id) {
    const comments = await this.commentService.findCommentByUserId(id);
    return res.status(HttpStatus.OK).json(comments);
  }

  @Post('/post/:id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  public async create(@User('id') user, @Param('id') id, @Response() res, @Body() body: CommentDto) {
    const comment = await this.commentService.createComment(id, user, body);
    return res.status(HttpStatus.OK).json(comment);
  }

  @Put('/:id/image')
  @UseGuards(new AuthGuard())
  @UseInterceptors(FileInterceptor('image'))
  public async addPicture(@UploadedFile() file, @User('id') user, @Param('id') id, @Response() res) {
    const image = await this.commentService.addImage(id, user, file);
    return res.status(HttpStatus.OK).json(image);
  }

  @Get('/:id/image')
  @UseGuards(new AuthGuard())
  public async getPicture(@User('id') user, @Param('id') id, @Res() res) {
    const imagePath = await this.commentService.getImage(id, user);
    if (!imagePath) {
      throw new HttpException('Comment dont have image', HttpStatus.NOT_FOUND);
    }
    return res.sendFile(imagePath, { root: 'uploads' });
  }

  @Get('/:id')
  public async get(@Response() res, @Param('id') id) {
    const comment = await this.commentService.findCommentById(id);
    return res.status(HttpStatus.OK).json(comment);
  }

  @Delete('/:id')
  @UseGuards(new AuthGuard())
  public async delete(@Response() res, @User('id') user, @Param('id') id) {
    const comment = await this.commentService.deleteComment(id, user);
    return res.status(HttpStatus.OK).json(comment);
  }
}