import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Get('health')
  async healthCheck() {
    const count = await this.userRepository.count();
    return {
      status: 'OK',
      database: 'Connected',
      usersCount: count,
    };
  }
}
