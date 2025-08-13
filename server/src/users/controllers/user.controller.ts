import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/user.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import type { RequestWithUser } from '../../common/types/express';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({ status: 200, description: 'Usuários retornados com sucesso.' })
  @ApiResponse({ status: 204, description: 'Nenhum usuário encontrado.' })
  @ApiResponse({ status: 400, description: 'Erro ao listar usuários.' })
  async findAll(@Req() req: RequestWithUser) {
    return this.usersService.findAll(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Obter dados do usuário logado' })
  @ApiResponse({ status: 200, description: 'Perfil retornado com sucesso.' })
  @ApiResponse({ status: 204, description: 'Perfil não encontrado.' })
  @ApiResponse({ status: 400, description: 'Erro ao obter perfil.' })
  async getProfile(@Req() req: RequestWithUser) {
    console.log(1)
    return this.usersService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me/history')
  @ApiOperation({ summary: 'Obter histórico do usuário' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Histórico retornado com sucesso.' })
  @ApiResponse({ status: 204, description: 'Não há histórico.' })
  @ApiResponse({ status: 400, description: 'Erro ao buscar histórico.' })
  async getHistory(
    @Req() req: RequestWithUser,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    const { results, totalDocs, totalPages } =
      await this.usersService.getUserHistory(
        req.user.id,
        parseInt(page),
        parseInt(limit)
      );

    return {
      results,
      totalDocs,
      page: Number(page),
      totalPages,
      hasNext: Number(page) < totalPages,
      hasPrev: Number(page) > 1,
    };
  }
  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me/favorites')
   @ApiOperation({ summary: 'Obter favoritos do usuário' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Favoritos retornados com sucesso.' })
  @ApiResponse({ status: 204, description: 'Nenhum favorito encontrado.' })
  @ApiResponse({ status: 400, description: 'Erro ao buscar favoritos.' })
  
  async getFavorites(
    @Req() req: RequestWithUser,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    const { results, totalDocs, totalPages } =
      await this.usersService.getUserFavorites(
        req.user.id,
        parseInt(page),
        parseInt(limit)
      );

    return {
      results,
      totalDocs,
      page: Number(page),
      totalPages,
      hasNext: Number(page) < totalPages,
      hasPrev: Number(page) > 1,
    };
  }
}
