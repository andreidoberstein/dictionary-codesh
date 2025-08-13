import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/user.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(@Req() req) {
    return this.usersService.findAll(req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    return this.usersService.findOne((id), req.user);
  }
}