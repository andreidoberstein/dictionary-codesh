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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DictionaryController = void 0;
const common_1 = require("@nestjs/common");
const dictionary_service_1 = require("../services/dictionary.service");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
let DictionaryController = class DictionaryController {
    dictionaryService;
    constructor(dictionaryService) {
        this.dictionaryService = dictionaryService;
    }
    async findAll(search, page = '1', limit = '10') {
        return this.dictionaryService.findAll(search, parseInt(page, 10), parseInt(limit, 10));
    }
    async findOne(word) {
        return this.dictionaryService.findOne(word);
    }
    async favoriteWord(word, req) {
        const userId = req.user.id;
        await this.dictionaryService.favoriteWord(userId, word);
    }
    async unfavoriteWord(word, req) {
        await this.dictionaryService.unfavoriteWord(req.user.id, word);
    }
};
exports.DictionaryController = DictionaryController;
__decorate([
    (0, common_1.Get)('en'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], DictionaryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('en/:word'),
    __param(0, (0, common_1.Param)('word')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DictionaryController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('en/:word/favorite'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('word')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DictionaryController.prototype, "favoriteWord", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('en/:word/unfavorite'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('word')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DictionaryController.prototype, "unfavoriteWord", null);
exports.DictionaryController = DictionaryController = __decorate([
    (0, common_1.Controller)('entries'),
    __metadata("design:paramtypes", [dictionary_service_1.DictionaryService])
], DictionaryController);
//# sourceMappingURL=dictionary.controller.js.map