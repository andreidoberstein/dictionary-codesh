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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(user) {
        return this.prisma.user.findMany();
    }
    async update(id, dto, user) {
        return this.prisma.user.update({ where: { id }, data: dto });
    }
    async getProfile(userId) {
        console.log(3);
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        return user;
    }
    async getUserHistory(userId, page, limit) {
        const skip = (page - 1) * limit;
        const [results, totalDocs] = await Promise.all([
            this.prisma.wordHistories.findMany({
                where: { userId },
                orderBy: { accessedAt: 'desc' },
                skip,
                take: limit,
                select: {
                    word: true,
                    accessedAt: true,
                },
            }),
            this.prisma.wordHistories.count({ where: { userId } }),
        ]);
        const totalPages = Math.ceil(totalDocs / limit);
        return { results, totalDocs, totalPages };
    }
    async getUserFavorites(userId, page, limit) {
        const skip = (page - 1) * limit;
        const [results, totalDocs] = await Promise.all([
            this.prisma.favorite.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: {
                    word: true,
                    createdAt: true,
                },
            }),
            this.prisma.wordHistories.count({ where: { userId } }),
        ]);
        const totalPages = Math.ceil(totalDocs / limit);
        return { results, totalDocs, totalPages };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=user.service.js.map