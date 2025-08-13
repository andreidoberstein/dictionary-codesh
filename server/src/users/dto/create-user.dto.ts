import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class CreateUserDto {
  @ApiProperty({ example: 'Joe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'email@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'USER' })
  @IsEnum(Role)
  role: Role;
}
