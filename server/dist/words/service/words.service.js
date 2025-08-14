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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var WordsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const words_repository_1 = require("../repositories/words.repository");
let WordsService = WordsService_1 = class WordsService {
    wordsRepo;
    logger = new common_1.Logger(WordsService_1.name);
    constructor(wordsRepo) {
        this.wordsRepo = wordsRepo;
    }
    async importFromGitHub() {
        const limitImportWors = 5000;
        const rawUrl = 'https://raw.githubusercontent.com/meetDeveloper/freeDictionaryAPI/master/meta/wordList/english.txt';
        const { data } = await axios_1.default.get(rawUrl);
        let words = data
            .split('\n')
            .map(w => w.trim())
            .filter(Boolean);
        if (limitImportWors && words.length > limitImportWors) {
            words = words.slice(0, limitImportWors);
            this.logger.warn(`⚠️ Limitando importação para ${limitImportWors} palavras.`);
        }
        this.logger.log(`Encontradas ${words.length} palavras. Salvando no banco...`);
        await this.wordsRepo.upsertMany(words);
        this.logger.log('Importação concluída!');
    }
};
exports.WordsService = WordsService;
exports.WordsService = WordsService = WordsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [words_repository_1.WordsRepository])
], WordsService);
//# sourceMappingURL=words.service.js.map