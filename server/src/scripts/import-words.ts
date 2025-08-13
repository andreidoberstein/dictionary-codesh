import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { WordsService } from '../words/service/words.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const wordsService = app.get(WordsService);

  await wordsService.importFromGitHub();

  await app.close();
}

bootstrap();
