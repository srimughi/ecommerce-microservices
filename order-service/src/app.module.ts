import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Order } from './entities/order.entity';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5434'),
      username: process.env.DB_USERNAME || 'order_admin',
      password: process.env.DB_PASSWORD || 'order123',
      database: process.env.DB_NAME || 'order_db',
      entities: [Order],
      synchronize: true,
      autoLoadEntities: true,
    }),

    // Passport & JWT
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        'your-super-secret-jwt-key-change-this-in-production',
      signOptions: { expiresIn: '7d' },
    }),

    OrdersModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
