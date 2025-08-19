import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpErrorFilter } from './common/filters/http-error.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseTimeInterceptor } from './common/interceptors/response-time.interceptor';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  logger.log('Iniciando a aplicação...');

  try {
    const app = await NestFactory.create(AppModule, { cors: false });
    logger.log('Aplicação NestJS criada com sucesso');

    app.enableCors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
      optionsSuccessStatus: 204,
    });
    logger.log('CORS configurado');

    app.useGlobalFilters(new HttpErrorFilter());
    app.useGlobalInterceptors(new TransformResponseInterceptor());
    app.useGlobalInterceptors(new ResponseTimeInterceptor());

    const config = new DocumentBuilder()
      .setTitle('Dictionary challenge')
      .setDescription('API para gerenciamento de palavras, histórico e favoritos')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    logger.log('Swagger configurado');

    const PORT = Number(process.env.PORT) || 3000;
    logger.log(`Tentando iniciar o servidor na porta ${PORT}...`);
    await app.listen(PORT, '0.0.0.0');
    logger.log(`🚀 HTTP ouvindo em 0.0.0.0:${PORT}`);
  } catch (error) {
    logger.error('Erro ao iniciar a aplicação:', error.stack || error);
    throw error;
  }
}

bootstrap().catch((error) => {
  Logger.error('Falha no bootstrap:', error.stack || error);
  process.exit(1);
});