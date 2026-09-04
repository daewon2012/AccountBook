"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../src/app.module");
describe('health', () => {
    let app;
    beforeAll(async () => { const module = await testing_1.Test.createTestingModule({ imports: [app_module_1.AppModule] }).compile(); app = module.createNestApplication(); app.setGlobalPrefix('v1'); await app.init(); });
    afterAll(() => app.close());
    it('reports liveness', () => (0, supertest_1.default)(app.getHttpServer()).get('/v1/health/live').expect(200, { status: 'ok' }));
});
//# sourceMappingURL=health.spec.js.map