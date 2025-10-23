import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AppController } from './app.controller'; // ← تأكد إنه موجود
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'user_admin',
      password: process.env.DB_PASSWORD || 'user123',
      database: process.env.DB_NAME || 'user_db',
      entities: [User],
      synchronize: true,
      autoLoadEntities: true,
    }),

    // إضافة الـ User repository للـ AppModule
    TypeOrmModule.forFeature([User]),

    AuthModule,
  ],
  controllers: [AppController], // ← تأكد إنه موجود
})
export class AppModule {}
