import { PrismaService } from '../../prisma/prisma.service';
import { UserEntity } from '../entities/user.entity';
import { IUsersService } from '../interfaces/users-service.interface';
import { UpdateUserDto } from '../dto/update-user.dto';
export declare class UsersService implements IUsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(user: any): Promise<UserEntity[]>;
    update(id: string, dto: UpdateUserDto, user: any): Promise<UserEntity>;
    getProfile(userId: string): Promise<{
        email: string;
        name: string;
        role: string;
        createdAt: Date;
    }>;
    getUserHistory(userId: string, page: number, limit: number): Promise<{
        results: {
            word: {
                id: string;
                createdAt: Date;
                text: string;
            };
            accessedAt: Date;
        }[];
        totalDocs: number;
        totalPages: number;
    }>;
    getUserFavorites(userId: string, page: number, limit: number): Promise<{
        results: {
            word: string;
            createdAt: Date;
        }[];
        totalDocs: number;
        totalPages: number;
    }>;
}
