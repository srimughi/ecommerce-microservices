import {
  Injectable,
  NotFoundException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Order, OrderStatus } from '../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @Inject('PRODUCT_SERVICE')
    private productClient: ClientProxy,
  ) {
    // تأكد من الاتصال بـ RabbitMQ
    this.productClient
      .connect()
      .then(() => {
        console.log('✅ Order Service connected to RabbitMQ');
      })
      .catch((err) => {
        console.error('❌ Order Service failed to connect to RabbitMQ:', err);
      });
  }

  // Create Order
  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    const { items } = createOrderDto;

    // TODO: Validate products and get prices from Product Service
    // في الواقع، لازم نروح للـ Product Service نجيب المنتجات والأسعار
    // بس عشان نسهّل الموضوع دلوقتي، هنفترض إن المنتجات موجودة

    // Dummy data للتوضيح (هنستبدله بعدين بـ call حقيقي للـ Product Service)
    const orderItems = items.map((item) => ({
      productId: item.productId,
      productName: 'Product Name', // هنجيبه من Product Service
      quantity: item.quantity,
      price: 1000, // هنجيبه من Product Service
    }));

    // حساب الـ total
    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // إنشاء الطلب
    const order = this.orderRepository.create({
      userId,
      items: orderItems,
      totalAmount,
      status: OrderStatus.PENDING,
    });

    // حفظ الطلب في الـ database
    const savedOrder = await this.orderRepository.save(order);

    console.log(`📦 Order created: ${savedOrder.id}`);

    // إرسال message لـ Product Service عشان يقلل الـ stock
    items.forEach((item) => {
      console.log(
        `📤 Sending message to decrease stock for product: ${item.productId}, quantity: ${item.quantity}`,
      );

      this.productClient.emit('decrease_stock', {
        productId: item.productId,
        quantity: item.quantity,
        orderId: savedOrder.id,
      });

      console.log(`✅ Message sent for product: ${item.productId}`);
    });

    return savedOrder;
  }

  // Get All Orders (للـ user معين)
  async findAllByUser(userId: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // Get One Order
  async findOne(id: string, userId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id, userId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  // Cancel Order
  async cancel(id: string, userId: string): Promise<Order> {
    const order = await this.findOne(id, userId);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    order.status = OrderStatus.CANCELLED;
    return await this.orderRepository.save(order);
  }
}
