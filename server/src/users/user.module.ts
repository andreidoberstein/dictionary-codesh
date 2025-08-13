import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersController } from './controllers/user.controller';
import { UsersService } from './services/user.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}