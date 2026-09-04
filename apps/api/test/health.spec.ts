import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
describe('health', () => {
  let app: INestApplication;
  beforeAll(async () => { const module = await Test.createTestingModule({ imports: [AppModule] }).compile(); app = module.createNestApplication(); app.setGlobalPrefix('v1'); await app.init(); });
  afterAll(() => app.close());
  it('reports liveness', () => request(app.getHttpServer()).get('/v1/health/live').expect(200, { status: 'ok' }));
});
