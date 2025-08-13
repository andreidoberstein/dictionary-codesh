import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req) {
    return this.usersService.findAll(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    return this.usersService.findOne((id), req.user);
  }
}