import { IsNotEmpty } from 'class-validator';

export class HashtagDto {
  @IsNotEmpty()
  title: string;
}