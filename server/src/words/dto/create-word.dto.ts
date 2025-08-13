import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWordDto {
  @ApiProperty({ example: 'branch' })
  @IsString()
  @IsNotEmpty()
  text: string;
}
