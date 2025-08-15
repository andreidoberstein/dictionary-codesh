import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  getRootMessage() {
    return { message: 'Fullstack Challenge 🏅 - Dictionary' };
  }
}
