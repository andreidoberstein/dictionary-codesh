"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_error_filter_1 = require("./common/filters/http-error.filter");
const transform_response_interceptor_1 = require("./common/interceptors/transform-response.interceptor");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new http_error_filter_1.HttpErrorFilter());
    app.useGlobalInterceptors(new transform_response_interceptor_1.TransformResponseInterceptor());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Dictionary challenge')
        .setDescription('API para gerenciamento de palavras, histórico e favoritos')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(process.env.PORT ?? 3030);
}
bootstrap();
//# sourceMappingURL=main.js.map