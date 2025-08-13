"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const words_service_1 = require("../words/service/words.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const wordsService = app.get(words_service_1.WordsService);
    await wordsService.importFromGitHub();
    await app.close();
}
bootstrap();
//# sourceMappingURL=import-words.js.map