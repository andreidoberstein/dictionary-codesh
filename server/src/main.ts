import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpErrorFilter } from './common/filters/http-error.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseTimeInterceptor } from './common/interceptors/response-time.interceptor';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create(AppModule, { cors: false });

  // 1) CORS logo no início
  const allowlist = [
    'https://dictionary-codesh-oo8155lnd-andreivupts-projects.vercel.app',
    'https://dictionary-codesh.vercel.app',
  ];

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // curl/health
      if (allowlist.includes(origin) || origin.endsWith('.vercel.app')) {
        return cb(null, true);
      }
      return cb(new Error('Origin not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','X-Requested-With','Accept','Origin'],
    optionsSuccessStatus: 204,
    preflightContinue: false, // Express encerra o OPTIONS
    // origin: [
    //   'https://dictionary-codesh-oo8155lnd-andreivupts-projects.vercel.app'
    // ],
    // credentials: true,
    // methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    // allowedHeaders: ['Content-Type','Authorization','X-Requested-With','Accept','Origin'],
    // optionsSuccessStatus: 204,
  });

  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      const origin = req.headers.origin as string | undefined;
      if (origin && (allowlist.includes(origin) || origin.endsWith('.vercel.app'))) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Vary', 'Origin');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
        res.header('Access-Control-Max-Age', '600');
        return res.sendStatus(204);
      }
      // origem não permitida -> ainda assim responda p/ evitar 502
      return res.status(204).end();
    }
    return next();
  });

  app.use((req, _res, next) => {
    if (req.method === 'OPTIONS') {
      Logger.log(`Preflight OPTIONS -> ${req.originalUrl}`, 'CORS');
    }
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
