import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserEntity } from '../entities/user.entity';
import { IUsersService } from '../interfaces/users-service.interface';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService implements IUsersService   {
  constructor(private prisma: PrismaService) {}

  async findAll(user: any): Promise<UserEntity[]> {
    return this.prisma.user.findMany();
  }

  async update(id: string, dto: UpdateUserDto, user: any): Promise<UserEntity> {
    return this.prisma.user.update({ where: { id }, data: dto });
  }

  async getProfile(userId: string) {
    console.log(3)
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
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async getUserHistory(userId: string, page: number, limit: number) {
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
  
  async getUserFavorites(userId: string, page: number, limit: number) {
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
}