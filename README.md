# Mini Credit Insights Service - Backend API Test

A backend API project demonstrating NestJS skills, external API integration, authentication, and data processing.

## 🎯 What I Built

This is a **backend technical assessment** that shows off:

- **Solid NestJS architecture** with clean separation of concerns
- **External API integration** with a custom mock credit bureau service
- **Comprehensive testing** - Unit and integration tests
- **Production-ready patterns** - Authentication, validation, error handling
- **Microservices setup** with Docker containerization
- **Database design** with TypeORM and MySQL

## 🏗️ Architecture

Clean architecture approach with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Backend Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  Controllers (REST API)  │  Services (Business Logic)         │
│  • Input Validation      │  • Data Processing                 │
│  • Request Handling      │  • External API Integration        │
│  • Response Formatting   │  • Business Rules                  │
├─────────────────────────────────────────────────────────────────┤
│  DTOs & Validation       │  Entities & Repositories           │
│  • Request/Response      │  • Data Models                     │
│  • Input Sanitization    │  • Database Operations             │
│  • Type Safety           │  • Query Optimization              │
├─────────────────────────────────────────────────────────────────┤
│                    External Services                            │
│  • Mock Credit Bureau API (Custom Implementation)             │
│  • Database (MySQL)                                    │
│  • Authentication (JWT)                                       │
└─────────────────────────────────────────────────────────────────┘
```

### Core Modules

- **`auth/`** - JWT authentication, role-based access control
- **`users/`** - User management and profiles
- **`statements/`** - CSV processing and transaction parsing
- **`insights/`** - Financial analysis and pattern recognition
- **`bureau/`** - External API integration
- **`audit/`** - Security logging and compliance
- **`health/`** - System monitoring and metrics

## 🚀 Key Features

### 🔐 **Authentication System**

- JWT-based authentication with secure token management
- Role-based access control (RBAC)
- Password hashing using bcrypt
- Token refresh and expiration handling
- Audit logging for security events

### 📊 **Data Processing**

- CSV statement parsing with error handling
- Transaction categorization and data validation
- Input validation using class-validator decorators
- Batch processing for large files
- Data integrity checks with rollback

### 🧠 **Financial Analysis Engine**

- Spending pattern analysis with trend identification
- Risk assessment based on financial behavior
- Anomaly detection for unusual transactions
- Budget recommendations using historical data
- Performance caching for analysis

### 🏦 **External API Integration**

- Custom mock credit bureau service built from scratch
- Retry logic with exponential backoff

## 🛠️ Technology Stack

### **Backend Foundation**

- Node.js 18+ with TypeScript
- NestJS framework with decorator-based architecture
- Dependency injection for loose coupling and testability

### **Database & ORM**

- TypeORM for database operations and migrations
- MySQL database with connection pooling
- Entity relationships with foreign key constraints
- Query optimization with strategic indexing

### **API & Documentation**

- RESTful API design following best practices
- Swagger/OpenAPI documentation with interactive testing
- Request/Response DTOs with comprehensive validation
- Consistent error handling

### **Testing & Quality**

- Jest testing framework with coverage reporting
- Unit tests for business logic
- Integration tests for API endpoints
- Integration tests for complete workflows
- Test database isolation

### **Security & Performance**

- Input validation and sanitization throughout
- CORS configuration for controlled access
- Rate limiting for API protection
- Connection pooling for database efficiency
- Memory management and health monitoring

## 🏗️ Mock Credit Bureau API

### **Custom Implementation**

Built a complete mock service demonstrating real-world API integration:

```javascript
const mockBureauFeatures = {
  authentication: "API key-based authentication",
  rateLimiting: "Request throttling and limits",
  retryLogic: "Exponential backoff implementation",
  errorSimulation: "Configurable failure scenarios",
  responseVariation: "Realistic credit score variations",
  logging: "Comprehensive request/response logging",
};
```

### **API Endpoints**

- `POST /v1/credit/check` - Simulate credit bureau check
- `GET /v1/health` - Service health monitoring
- `GET /v1/metrics` - Performance metrics

### **Integration Patterns**

- Retry mechanism with configurable attempts
- Request/response logging for debugging

## 📋 Setup

### **Prerequisites**

- Node.js 18+ with npm or yarn
- Docker and Docker Compose
- Git for version control

### **Quick Start**

```bash
git clone https://github.com/tobidun/Mini-Credit-Insights-Service.git
cd Mini-Credit-Insights-Service
docker-compose up -d
```

### **Local Development**

```bash
npm install
npm run start:dev
npm test
```

## 📚 API Reference

### **Authentication**

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
```

### **Statements**

```http
POST /api/v1/statements/upload
GET /api/v1/statements
GET /api/v1/statements/:id
```

### **Insights**

```http
POST /api/v1/insights/run
GET /api/v1/insights
GET /api/v1/insights/:id
```

### **Credit Bureau**

```http
POST /api/v1/bureau/check
GET /api/v1/bureau/reports
GET /api/v1/bureau/reports/:id
```

### **Health**

```http
GET /api/v1/health
GET /api/v1/health/metrics
```

## 🔧 Configuration

### **Environment Variables**

```env
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=user
DB_PASSWORD=password
DB_DATABASE=credit_insights

# Security
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# External API (Mock Bureau)
BUREAU_API_URL=http://bureau-mock:3001/v1/credit/check
BUREAU_API_KEY=mock-api-key-123
BUREAU_MAX_RETRIES=3
BUREAU_TIMEOUT=10000

# Logging
LOG_LEVEL=debug

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

## 📊 Data Models

### **Entity Relationships**

```typescript
User (1) ←→ (N) Statement
Statement (1) ←→ (N) Transaction
User (1) ←→ (N) Insight
User (1) ←→ (N) BureauReport
User (1) ←→ (N) AuditLog
```

### **Key Entities**

- **User**: Authentication, roles, and profile information
- **Statement**: Bank statement metadata and file storage
- **Transaction**: Individual financial transactions with categorization
- **Insight**: Computed financial analysis and recommendations
- **BureauReport**: Credit bureau data and scores
- **AuditLog**: System activity and security tracking

## 🔒 Security Features

- JWT Authentication with secure token handling
- Password hashing using bcrypt with salt rounds
- Input validation and sanitization throughout
- CORS configuration for controlled access
- Rate limiting for API protection
- Audit logging for complete activity tracking
- Secure error messages without information leakage

## 📈 Performance Features

- Database indexing for optimal query performance
- Connection pooling for efficient database connections
- Query optimization with TypeORM query builder

- Built-in health checks and performance metrics

## 🚀 Deployment

### **Production Considerations**

1. Environment Security: Strong, unique secrets
2. Database: Production-grade MySQL with backups
3. SSL/TLS: Proper certificates for HTTPS
4. Monitoring: Logging, alerting, and performance tracking
5. Scaling: Load balancing strategies
6. Security: Firewall, access control

### **Docker Deployment**

```bash
docker-compose build
docker-compose up -d
docker-compose logs -f backend
```

## 🧪 Testing

### **Testing Strategy**

- Unit tests for business logic and services
- Integration tests for API endpoints and database
- Test coverage reporting with npm run test:cov
- CI pipeline with automated testing

### **Test Commands**

```bash
npm test                    # Run all tests
npm run test:cov           # Tests with coverage
npm test -- --testPathPattern=auth  # Test specific module
npm run test:watch         # Watch mode
```

## 🔍 Interview Test Focus Areas

This project demonstrates proficiency in:

### **Advanced NestJS Development**

- Module architecture and dependency injection
- Custom decorators and interceptors
- Middleware and guard implementation
- Exception filters and error handling

### **External API Integration**

- HTTP client implementation with retry logic
- Comprehensive error handling and logging

### **Database Design & ORM**

- Entity relationship modeling
- Query optimization and indexing
- Migration management
- Data validation and integrity

### **Testing & Quality Assurance**

- Unit and integration testing
- Mock service implementation
- Test data management
- Coverage reporting and analysis

### **Production Readiness**

- Environment configuration management
- Security implementation
- Performance monitoring
- Docker containerization

**Backend-focused project demonstrating NestJS skills, external API integration, and production-ready patterns.**

GitHub: [Mini-Credit-Insights-Service](https://github.com/tobidun/Mini-Credit-Insights-Service)
