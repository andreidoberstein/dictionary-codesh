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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../services/user.service");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAll(req) {
        return this.usersService.findAll(req.user);
    }
    async getProfile(req) {
        console.log(1);
        return this.usersService.getProfile(req.user.id);
    }
    async getHistory(req, page = '1', limit = '10') {
        const { results, totalDocs, totalPages } = await this.usersService.getUserHistory(req.user.id, parseInt(page), parseInt(limit));
        return {
            results,
            totalDocs,
            page: Number(page),
            totalPages,
            hasNext: Number(page) < totalPages,
            hasPrev: Number(page) > 1,
        };
    }
    async getFavorites(req, page = '1', limit = '10') {
        const { results, totalDocs, totalPages } = await this.usersService.getUserFavorites(req.user.id, parseInt(page), parseInt(limit));
        return {
            results,
            totalDocs,
            page: Number(page),
            totalPages,
            hasNext: Number(page) < totalPages,
            hasPrev: Number(page) > 1,
        };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os usuários' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuários retornados com sucesso.' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Nenhum usuário encontrado.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Erro ao listar usuários.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter dados do usuário logado' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Perfil retornado com sucesso.' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Perfil não encontrado.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Erro ao obter perfil.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('me/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter histórico do usuário' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 10 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Histórico retornado com sucesso.' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Não há histórico.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Erro ao buscar histórico.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getHistory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('me/favorites'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter favoritos do usuário' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 10 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Favoritos retornados com sucesso.' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Nenhum favorito encontrado.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Erro ao buscar favoritos.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getFavorites", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UsersService])
], UsersController);
//# sourceMappingURL=user.controller.js.map