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
exports.DictionaryRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let DictionaryRepository = class DictionaryRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(search, pageParam, limitParam) {
        const page = Math.max(pageParam || 1, 1);
        const limit = Math.max(limitParam || 10, 1);
        const where = search
            ? { text: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } }
            : {};
        const totalDocs = await this.prisma.word.count({ where });
        const words = await this.prisma.word.findMany({
            where,
            select: { text: true },
            orderBy: { text: 'asc' },
            skip: (page - 1) * limit,
            take: limit,
        });
        const totalPages = Math.ceil(totalDocs / limit);
        return {
            results: words.map((w) => w.text),
            totalDocs,
            page,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        };
    }
};
exports.DictionaryRepository = DictionaryRepository;
exports.DictionaryRepository = DictionaryRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DictionaryRepository);
//# sourceMappingURL=dictionary.repository.js.map