import {
  Controller,
  Response,
  Post,
  Body,
  Get,
  HttpStatus,
  UsePipes,
  ValidationPipe, UseGuards, Query, Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { AuthGuard } from '../shared/auth.guard';
import { User } from './user.decorator';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  @Get()
  @UseGuards(new AuthGuard())
  public async getAllUsers(@User() user, @Response() res, @Query() query) {
    const users = await this.userService.findAll(query);
    return res.status(HttpStatus.OK).json(users);
  }

  @Get('/user')
  @UseGuards(new AuthGuard())
  public async showMe(@User('username') username: string, @Response() res) {
    const user = await this.userService.getUser(username);
    return res.status(HttpStatus.OK).json(user);
  }

  @Post('/login')
  @UsePipes(new ValidationPipe())
  public async login(@Response() res, @Body() body: UserDto) {
    const user = await this.userService.loginUser(body);
    return res.status(HttpStatus.OK).json(user);
  }

  @Post('/register')
  public async register(@Response() res, @Body() body: UserDto) {
    const user = await this.userService.registerUser(body);
    return res.status(HttpStatus.OK).json(user);
  }
}