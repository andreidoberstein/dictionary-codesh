"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_error_filter_1 = require("./common/filters/http-error.filter");
const transform_response_interceptor_1 = require("./common/interceptors/transform-response.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new http_error_filter_1.HttpErrorFilter());
    app.useGlobalInterceptors(new transform_response_interceptor_1.TransformResponseInterceptor());
    await app.listen(process.env.PORT ?? 3030);
}
bootstrap();
//# sourceMappingURL=main.js.map