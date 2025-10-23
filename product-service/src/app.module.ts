import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5433'),
      username: process.env.DB_USERNAME || 'product_admin',
      password: process.env.DB_PASSWORD || 'product123',
      database: process.env.DB_NAME || 'product_db',
      entities: [Product],
      synchronize: true,
      autoLoadEntities: true,
    }),

    ProductsModule,
  ],
})
export class AppModule {}
