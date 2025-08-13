import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DictionaryService } from '../services/dictionary.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import type { RequestWithUser } from 'src/common/types/express';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Dictionary')
@Controller('entries')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}
  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('en')
  @ApiOperation({ summary: 'Listar palavras (opcionalmente filtradas por search)' })
  @ApiQuery({ name: 'search', required: false, example: 'apple' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Palavras retornadas com sucesso.' })
  @ApiResponse({ status: 204, description: 'Nenhuma palavra encontrada.' })
  @ApiResponse({ status: 400, description: 'Erro ao buscar palavras.' })
  async findAll(
    @Query('search') search?: string | any,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.dictionaryService.findAll(
      search,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }
  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('en/:word')
  @ApiOperation({ summary: 'Buscar uma palavra específica' })
  @ApiResponse({ status: 200, description: 'Palavra retornada com sucesso.' })
  @ApiResponse({ status: 204, description: 'Palavra não encontrada.' })
  @ApiResponse({ status: 400, description: 'Erro ao buscar palavra.' })
  async findOne(@Param('word') word: string) {
    return this.dictionaryService.findOne(word);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('en/:word/favorite')
  @HttpCode(204)
  @ApiOperation({ summary: 'Marcar palavra como favorita' })
  @ApiResponse({ status: 204, description: 'Palavra favoritada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Erro ao favoritar palavra.' })
  async favoriteWord(
    @Param('word') word: string,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    const userId = req.user.id;
    await this.dictionaryService.favoriteWord(userId, word);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('en/:word/unfavorite')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover palavra dos favoritos' })
  @ApiResponse({ status: 204, description: 'Palavra removida dos favoritos.' })
  @ApiResponse({ status: 400, description: 'Erro ao remover palavra dos favoritos.' })
  async unfavoriteWord(
    @Param('word') word: string,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    await this.dictionaryService.unfavoriteWord(req.user.id, word);
  }
}
