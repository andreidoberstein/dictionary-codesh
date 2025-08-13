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

@Controller('entries')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Get('en')
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

  @Get('en/:word')
  async findOne(@Param('word') word: string) {
    return this.dictionaryService.findOne(word);
  }

  @UseGuards(JwtAuthGuard)
  @Post('en/:word/favorite')
  @HttpCode(204)
  async favoriteWord(
    @Param('word') word: string,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    const userId = req.user.id;
    await this.dictionaryService.favoriteWord(userId, word);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('en/:word/unfavorite')
  @HttpCode(204)
  async unfavoriteWord(
    @Param('word') word: string,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    await this.dictionaryService.unfavoriteWord(req.user.id, word);
  }
}
