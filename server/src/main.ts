import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpErrorFilter } from './common/filters/http-error.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseTimeInterceptor } from './common/interceptors/response-time.interceptor';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://dictionary-codesh-oo8155lnd-andreivupts-projects.vercel.app/'
    ],
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
    optionsSuccessStatus: 204,
  });

  // Garante headers de CORS até em 404/500 e responde preflight OPTIONS
  app.use((req, res, next) => {
    const origin = req.headers.origin as string | undefined;
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Vary', 'Origin');
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
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
  Logger.log(`🚀 HTTP ouvindo em 0.0.0.0:${PORT}`, 'Bootstrap');
}
bootstrap();
