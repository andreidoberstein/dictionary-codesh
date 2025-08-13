import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpErrorFilter } from './common/filters/http-error.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpErrorFilter());  
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  await app.listen(process.env.PORT ?? 3030);
}
bootstrap();
