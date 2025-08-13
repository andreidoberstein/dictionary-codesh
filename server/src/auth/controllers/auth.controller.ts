import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/signin.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiResponse({ status: 200, description: 'Usuário registrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Erro ao registrar usuário.' })
  
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('signin')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login do usuário' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Credenciais inválidas.' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}