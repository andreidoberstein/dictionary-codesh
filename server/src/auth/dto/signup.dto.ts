  import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

  export class RegisterDto {
    @ApiProperty({ example: 'Joe' })
    @IsString()
    name: string;
    
    @ApiProperty({ example: 'usuario@email.com' })
    @IsEmail()
    email: string;
    
    @ApiProperty({ example: 'senha123' })
    @IsString()
    @MinLength(6)
    password: string;
  }