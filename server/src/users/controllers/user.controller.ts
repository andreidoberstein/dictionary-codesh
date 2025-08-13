import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/user.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import type { RequestWithUser } from 'src/common/types/express';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: RequestWithUser) {
    return this.usersService.findAll(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: RequestWithUser) {
    console.log(1)
    return this.usersService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/history')
  async getHistory(
    @Req() req: RequestWithUser,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    const { results, totalDocs, totalPages } =
      await this.usersService.getUserHistory(
        req.user.id,
        parseInt(page),
        parseInt(limit)
      );

    return {
      results,
      totalDocs,
      page: Number(page),
      totalPages,
      hasNext: Number(page) < totalPages,
      hasPrev: Number(page) > 1,
    };
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('me/favorites')
  async getFavorites(
    @Req() req: RequestWithUser,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    const { results, totalDocs, totalPages } =
      await this.usersService.getUserFavorites(
        req.user.id,
        parseInt(page),
        parseInt(limit)
      );

    return {
      results,
      totalDocs,
      page: Number(page),
      totalPages,
      hasNext: Number(page) < totalPages,
      hasPrev: Number(page) > 1,
    };
  }
}
