# 🛒 E-Commerce Microservices Platform

A scalable e-commerce backend system built with **NestJS** microservices architecture, demonstrating modern software engineering practices and cloud-native design patterns.

## 🏗️ Architecture Overview
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │     │   Product   │     │    Order    │
│   Service   │     │   Service   │     │   Service   │
│  (Port 3001)│     │ (Port 3002) │     │ (Port 3003) │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                    │
       │                   │                    │
       └───────────────────┴────────────────────┘
                           │
                    ┌──────▼──────┐
                    │  RabbitMQ   │
                    │ (Event Bus) │
                    └─────────────┘
```

## 🚀 Key Features

### Microservices Architecture
- **User Service**: JWT-based authentication and authorization
- **Product Service**: Product catalog management with real-time stock updates
- **Order Service**: Order processing with event-driven communication

### Technology Stack
- **Backend Framework**: NestJS (Node.js)
- **Database**: PostgreSQL (3 separate databases - Database per Service pattern)
- **Message Broker**: RabbitMQ (Event-driven communication)
- **Authentication**: JWT (JSON Web Tokens)
- **ORM**: TypeORM
- **Validation**: class-validator
- **Security**: bcrypt password hashing
- **Containerization**: Docker & Docker Compose

### Design Patterns & Best Practices
- ✅ Microservices Architecture
- ✅ Event-Driven Architecture
- ✅ Database per Service
- ✅ API Gateway Ready
- ✅ JWT Authentication
- ✅ SOLID Principles
- ✅ DTOs for Validation
- ✅ Dependency Injection
- ✅ Repository Pattern

## 📦 Services

### 1. User Service (Port 3001)
**Responsibilities:**
- User registration and authentication
- JWT token generation and validation
- Password hashing with bcrypt

**Endpoints:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (Protected)

### 2. Product Service (Port 3002)
**Responsibilities:**
- Product CRUD operations
- Stock management
- Event consumption from RabbitMQ

**Endpoints:**
- `POST /products` - Create product
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product

**Events Consumed:**
- `decrease_stock` - Decreases product stock when order is placed

### 3. Order Service (Port 3003)
**Responsibilities:**
- Order creation and management
- Order status tracking
- Event publishing to RabbitMQ

**Endpoints:**
- `POST /orders` - Create order (Protected)
- `GET /orders` - Get user orders (Protected)
- `GET /orders/:id` - Get order by ID (Protected)
- `PATCH /orders/:id/cancel` - Cancel order (Protected)

**Events Published:**
- `decrease_stock` - Triggers stock decrease in Product Service

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/ecommerce-microservices.git
cd ecommerce-microservices
```

### 2. Start infrastructure (PostgreSQL + RabbitMQ)
```bash
docker-compose up -d
```

### 3. Install dependencies for each service
```bash
# User Service
cd user-service
npm install

# Product Service
cd ../product-service
npm install

# Order Service
cd ../order-service
npm install
```

### 4. Configure environment variables
Create `.env` files in each service directory (refer to `.env.example`)

### 5. Run services
```bash
# Terminal 1 - User Service
cd user-service
npm run start:dev

# Terminal 2 - Product Service
cd product-service
npm run start:dev

# Terminal 3 - Order Service
cd order-service
npm run start:dev
```

## 🔧 Configuration

### Environment Variables

**User Service (.env)**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=user_admin
DB_PASSWORD=user123
DB_NAME=user_db
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d
PORT=3001
```

**Product Service (.env)**
```env
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=product_admin
DB_PASSWORD=product123
DB_NAME=product_db
RABBITMQ_URL=amqp://admin:admin123@localhost:5672
PORT=3002
```

**Order Service (.env)**
```env
DB_HOST=localhost
DB_PORT=5434
DB_USERNAME=order_admin
DB_PASSWORD=order123
DB_NAME=order_db
RABBITMQ_URL=amqp://admin:admin123@localhost:5672
JWT_SECRET=your-secret-key
PORT=3003
```

## 📊 Database Schema

### User Service
```sql
Table: users
- id (UUID, PK)
- email (VARCHAR, UNIQUE)
- password (VARCHAR, HASHED)
- name (VARCHAR)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

### Product Service
```sql
Table: products
- id (UUID, PK)
- name (VARCHAR)
- description (TEXT)
- price (DECIMAL)
- stock (INTEGER)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

### Order Service
```sql
Table: orders
- id (UUID, PK)
- userId (VARCHAR)
- items (JSONB)
- totalAmount (DECIMAL)
- status (ENUM: pending, completed, cancelled)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

## 🧪 Testing

### Manual Testing with Postman/Insomnia

1. **Register User**
```http
POST http://localhost:3001/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

2. **Login**
```http
POST http://localhost:3001/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

3. **Create Product**
```http
POST http://localhost:3002/products
Content-Type: application/json

{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 1500,
  "stock": 10
}
```

4. **Create Order** (requires JWT token)
```http
POST http://localhost:3003/orders
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "items": [
    {
      "productId": "PRODUCT_ID",
      "quantity": 2
    }
  ]
}
```

## 🎯 Future Enhancements

- [ ] API Gateway implementation
- [ ] Service discovery (Consul/Eureka)
- [ ] Distributed tracing (Jaeger)
- [ ] Circuit breaker pattern
- [ ] Rate limiting
- [ ] Caching layer (Redis)
- [ ] Payment integration
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Unit & Integration tests
- [ ] CI/CD pipeline
- [ ] Kubernetes deployment

## 📝 Lessons Learned

- Implementing event-driven architecture with RabbitMQ
- Managing distributed transactions
- JWT authentication across microservices
- Database per service pattern
- Docker containerization

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 📄 License

This project is licensed under the MIT License.