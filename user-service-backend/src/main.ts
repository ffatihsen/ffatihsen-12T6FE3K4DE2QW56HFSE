import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  
  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}`);
  
}
bootstrap();
