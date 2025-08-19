import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpErrorFilter } from './common/filters/http-error.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseTimeInterceptor } from './common/interceptors/response-time.interceptor';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
      optionsSuccessStatus: 204,
    });

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

    const PORT = Number(process.env.PORT) || 3000;
    await app.listen(PORT, '0.0.0.0');
  } catch (error) {
    throw error;
  }
}

bootstrap().catch((error) => {
  Logger.error('Falha no bootstrap:', error.stack || error);
  process.exit(1);
});