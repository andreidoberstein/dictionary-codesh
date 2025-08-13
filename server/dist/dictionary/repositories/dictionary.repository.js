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
    async findAll(search, cursor, limitParam) {
        const limit = Math.max(limitParam || 10, 1);
        const where = search
            ? { text: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } }
            : {};
        const totalDocs = await this.prisma.word.count({ where });
        const decodedCursor = cursor
            ? JSON.parse(Buffer.from(cursor, 'base64').toString('ascii'))
            : null;
        const queryOptions = {
            where,
            select: { text: true },
            orderBy: { text: 'asc' },
            take: limit + 1,
        };
        if (decodedCursor) {
            queryOptions.cursor = { text: decodedCursor.text };
            queryOptions.skip = 1;
        }
        const words = await this.prisma.word.findMany(queryOptions);
        let hasNext = false;
        let hasPrev = !!decodedCursor;
        if (words.length > limit) {
            hasNext = true;
            words.pop();
        }
        const nextCursor = hasNext
            ? Buffer.from(JSON.stringify({ text: words[words.length - 1].text })).toString('base64')
            : null;
        const prevCursor = hasPrev
            ? Buffer.from(JSON.stringify({ text: words[0].text })).toString('base64')
            : null;
        return {
            results: words.map((w) => w.text),
            totalDocs,
            previous: prevCursor,
            next: nextCursor,
            hasNext,
            hasPrev,
        };
    }
    async findByWord(word) {
        return this.prisma.word.findUnique({
            where: { text: word },
            select: {
                id: true,
                text: true,
                createdAt: true,
            }
        });
    }
    async registerHistory(word) {
        const entry = await this.prisma.word.findUnique({
            where: { text: word },
            select: { id: true },
        });
        if (!entry)
            return;
        await this.prisma.wordHistories.create({
            data: {
                wordId: entry.id,
                accessedAt: new Date(),
            }
        });
    }
    async addFavorite(userId, word) {
        await this.prisma.favorite.upsert({
            where: {
                userId_word: { userId, word },
            },
            update: {},
            create: {
                userId,
                word,
            },
        });
    }
    async unfavoriteWord(userId, word) {
        const favorite = await this.prisma.favorite.findFirst({
            where: { userId, word },
        });
        if (!favorite) {
            throw new common_1.NotFoundException(`A palavra "${word}" não está nos favoritos`);
        }
        await this.prisma.favorite.delete({
            where: { id: favorite.id },
        });
    }
};
exports.DictionaryRepository = DictionaryRepository;
exports.DictionaryRepository = DictionaryRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DictionaryRepository);
//# sourceMappingURL=dictionary.repository.js.map