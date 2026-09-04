import 'reflect-metadata';
import { randomUUID } from 'node:crypto';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  app.use((
    req: { header(name: string): string | undefined },
    res: { setHeader(name: string, value: string): void },
    next: () => void,
  ) => {
    res.setHeader('x-correlation-id', req.header('x-correlation-id') ?? randomUUID());
    next();
  });
  const config = new DocumentBuilder().setTitle('AccountBook API').setVersion('1').build();
  SwaggerModule.setup('openapi', app, SwaggerModule.createDocument(app, config));
  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT ?? 3001));
}
void bootstrap();
