import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen( process.env.CAMBOX_API_PORT || process.env.PORT );
}
bootstrap();
