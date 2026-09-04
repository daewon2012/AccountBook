"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const node_crypto_1 = require("node:crypto");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('v1');
    app.use((req, res, next) => {
        res.setHeader('x-correlation-id', req.header('x-correlation-id') ?? (0, node_crypto_1.randomUUID)());
        next();
    });
    const config = new swagger_1.DocumentBuilder().setTitle('AccountBook API').setVersion('1').build();
    swagger_1.SwaggerModule.setup('openapi', app, swagger_1.SwaggerModule.createDocument(app, config));
    app.enableShutdownHooks();
    await app.listen(Number(process.env.PORT ?? 3001));
}
void bootstrap();
//# sourceMappingURL=main.js.map