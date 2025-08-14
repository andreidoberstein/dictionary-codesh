import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpErrorFilter } from './common/filters/http-error.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpErrorFilter());  
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Dictionary challenge')
    .setDescription('API para gerenciamento de palavras, histórico e favoritos')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 
  app.enableCors();

  await app.listen(process.env.PORT ?? 3030);
}
bootstrap();
