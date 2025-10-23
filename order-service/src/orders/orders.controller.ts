import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard) // كل الـ endpoints محمية
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // POST /orders - إنشاء طلب جديد
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    const userId = req.user.id;
    return await this.ordersService.create(createOrderDto, userId);
  }

  // GET /orders - عرض كل طلبات الـ user
  @Get()
  async findAll(@Request() req) {
    const userId = req.user.id;
    return await this.ordersService.findAllByUser(userId);
  }

  // GET /orders/:id - عرض طلب معين
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return await this.ordersService.findOne(id, userId);
  }

  // PATCH /orders/:id/cancel - إلغاء طلب
  @Patch(':id/cancel')
  async cancel(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return await this.ordersService.cancel(id, userId);
  }
}