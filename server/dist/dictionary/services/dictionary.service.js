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
exports.DictionaryService = void 0;
const common_1 = require("@nestjs/common");
const dictionary_repository_1 = require("../repositories/dictionary.repository");
let DictionaryService = class DictionaryService {
    dictionaryRepository;
    constructor(dictionaryRepository) {
        this.dictionaryRepository = dictionaryRepository;
    }
    async findAll(search, cursor, limit) {
        return this.dictionaryRepository.findAll(search, cursor, limit);
    }
    async findOne(word) {
        const entry = await this.dictionaryRepository.findByWord(word);
        if (!entry) {
            throw new common_1.NotFoundException(`Palavra "${word}" não encontrada`);
        }
        await this.dictionaryRepository.registerHistory(word);
        return entry;
    }
    async favoriteWord(userId, word) {
        const entry = await this.dictionaryRepository.findByWord(word);
        if (!entry) {
            throw new common_1.NotFoundException(`Palavra "${word}" não encontrada`);
        }
        await this.dictionaryRepository.addFavorite(userId, word);
    }
    async unfavoriteWord(userId, word) {
        await this.dictionaryRepository.unfavoriteWord(userId, word);
    }
};
exports.DictionaryService = DictionaryService;
exports.DictionaryService = DictionaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dictionary_repository_1.DictionaryRepository])
], DictionaryService);
//# sourceMappingURL=dictionary.service.js.map