import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
describe('OrdersService', () => {
  let service: OrdersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ providers: [{ provide: OrdersService, useValue: { create: jest.fn(), findAll: jest.fn(), findOne: jest.fn() } }] }).compile();
    service = module.get<OrdersService>(OrdersService);
  });
  it('should be defined', () => { expect(service).toBeDefined(); });
});
