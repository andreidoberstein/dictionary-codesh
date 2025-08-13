"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const words_service_1 = require("../service/words.service");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
let WordsController = class WordsController {
    wordsService;
    constructor(wordsService) {
        this.wordsService = wordsService;
    }
    async importFromGitHub() {
        await this.wordsService.importFromGitHub();
        return { message: 'Importação concluída com sucesso.' };
    }
};
exports.WordsController = WordsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('import/github'),
    (0, swagger_1.ApiOperation)({ summary: 'Importar palavras do GitHub' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Importação realizada com sucesso.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Erro ao importar palavras.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WordsController.prototype, "importFromGitHub", null);
exports.WordsController = WordsController = __decorate([
    (0, swagger_1.ApiTags)('Words'),
    (0, common_1.Controller)('words'),
    __metadata("design:paramtypes", [words_service_1.WordsService])
], WordsController);
//# sourceMappingURL=words.controller.js.map