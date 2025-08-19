import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WordsService } from '../service/words.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Words')
@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('import/github')
  @ApiOperation({ summary: 'Importar palavras do GitHub' })
  @ApiResponse({ status: 200, description: 'Importação realizada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Erro ao importar palavras.' })
  async importFromGitHub() {
    // await this.wordsService.importFromGitHub();
    // return { message: 'Importação concluída com sucesso.' };
  }
}
