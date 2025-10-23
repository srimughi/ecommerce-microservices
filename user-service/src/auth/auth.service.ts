import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { User } from '../entities/user.entity';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Register: تسجيل user جديد
  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    // تحقق: هل الـ email موجود من قبل؟
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // إنشاء user جديد
    const user = this.userRepository.create({
      email,
      password, // هيتشفّر automatically بسبب @BeforeInsert في الـ Entity
      name,
    });

    // حفظ الـ user في الـ database
    await this.userRepository.save(user);

    // إصدار JWT token
    const token = this.generateToken(user);

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  // Login: تسجيل دخول
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // البحث عن الـ user
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // التحقق من الباسورد
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // إصدار JWT token
    const token = this.generateToken(user);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  // Helper: توليد JWT token
  private generateToken(user: User): string {
    const payload = {
      sub: user.id, // sub = subject (معرّف الـ user)
      email: user.email,
    };

    return this.jwtService.sign(payload);
  }

  // Validate User: للتحقق من الـ token (هنستخدمها في الـ JWT Strategy)
  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
