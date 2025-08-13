import { PrismaService } from '../../prisma/prisma.service';
import { UserEntity } from '../entities/user.entity';
import { IUsersService } from '../interfaces/users-service.interface';
import { UpdateUserDto } from '../dto/update-user.dto';
export declare class UsersService implements IUsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(user: any): Promise<UserEntity[]>;
    findOne(id: string, user: any): Promise<UserEntity>;
    update(id: string, dto: UpdateUserDto, user: any): Promise<UserEntity>;
}
