import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // Create: إضافة منتج جديد
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  // Read All: عرض كل المنتجات
  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // Read One: عرض منتج واحد بالـ ID
  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  // Update: تعديل منتج
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    // تحديث البيانات
    Object.assign(product, updateProductDto);

    return await this.productRepository.save(product);
  }

  // Delete: حذف منتج
  async remove(id: string): Promise<{ message: string }> {
    const product = await this.findOne(id);

    await this.productRepository.remove(product);

    return { message: `Product ${product.name} deleted successfully` };
  }

  // Helper: تقليل الكمية (هنستخدمها لما Order Service يطلب)
  async decreaseStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);

    if (product.stock < quantity) {
      throw new Error(`Not enough stock for product ${product.name}`);
    }

    product.stock -= quantity;
    return await this.productRepository.save(product);
  }

  // Message Handler: استقبال events من RabbitMQ
  async handleDecreaseStock(data: {
    productId: string;
    quantity: number;
    orderId: string;
  }) {
    try {
      const product = await this.decreaseStock(data.productId, data.quantity);
      console.log(
        `✅ Stock decreased for product ${product.name}. Order ID: ${data.orderId}`,
      );
      return { success: true, product };
    } catch (error) {
      console.error(
        `❌ Failed to decrease stock for product ${data.productId}:`,
        error.message,
      );
      return { success: false, error: error.message };
    }
  }
}
