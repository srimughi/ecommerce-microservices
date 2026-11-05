import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { User } from './entities/user.entity';

describe('AppController', () => {
  let appController: AppController;
  const mockUserRepository = { count: jest.fn().mockResolvedValue(3) };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [AppController], providers: [{ provide: getRepositoryToken(User), useValue: mockUserRepository }] }).compile();
    appController = module.get<AppController>(AppController);
  });
  it('should return health status', async () => {
    const result = await appController.healthCheck();
    expect(result.status).toBe('OK');
    expect(result.database).toBe('Connected');
    expect(result.usersCount).toBe(3);
  });
});
