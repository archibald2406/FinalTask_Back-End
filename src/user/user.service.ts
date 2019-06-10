import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserDto } from './user.dto';
import { UserRO } from './user.ro';

@Injectable()
export class UserService {
  constructor(@Inject('USERS_REPOSITORY') private userRepository: typeof UserEntity) { }

  async findAll(query: any): Promise<UserRO[]> {
    const users = await this.userRepository.findAll<UserEntity>({
      limit: parseInt(query.limit, 10) || 1000,
      offset: parseInt(query.offset, 10) || 0,
    });
    return users.map(user => user.toResponseObject(false));
  }

  async getUser(username: string): Promise<UserRO> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    return user.toResponseObject(false);
  }

  async loginUser(data: UserDto): Promise<UserRO> {
    const {username, password} = data;
    const user = await this.userRepository.findOne({where: {username}});
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user.toResponseObject();
  }

  async registerUser(data: UserDto): Promise<UserRO> {
    const {username} = data;
    let user = await this.userRepository.findOne({where: {username}});
    if (user) {
      throw new HttpException(
        'User with same name already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    user = await this.userRepository.create(data);
    return user.toResponseObject();
  }
}