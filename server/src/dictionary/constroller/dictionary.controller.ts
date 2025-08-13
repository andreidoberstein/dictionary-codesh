import { Controller, Get, Query } from "@nestjs/common";
import { DictionaryService } from "../services/dictionary.service";

@Controller('entries')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Get('en')
  async findAll(
    @Query('search') search?: string | any,
    @Query('page') page = "1",
    @Query('limit') limit = "10",
  ) {
    return this.dictionaryService.findAll(
      search,
      parseInt(page, 10),
      parseInt(limit, 10),
    )
  }
}