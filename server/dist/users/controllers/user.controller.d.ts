import { UsersService } from '../services/user.service';
import type { RequestWithUser } from '../../common/types/express';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(req: RequestWithUser): Promise<import("../entities/user.entity").UserEntity[]>;
    getProfile(req: RequestWithUser): Promise<{
        email: string;
        name: string;
        role: string;
        createdAt: Date;
    }>;
    getHistory(req: RequestWithUser, page?: string, limit?: string): Promise<{
        results: {
            accessedAt: Date;
            word: {
                id: string;
                createdAt: Date;
                text: string;
            };
        }[];
        totalDocs: number;
        page: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    getFavorites(req: RequestWithUser, page?: string, limit?: string): Promise<{
        results: {
            createdAt: Date;
            word: string;
        }[];
        totalDocs: number;
        page: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
}
