# Credit Insights Service

A comprehensive financial analysis platform that ingests bank statements, computes spending insights, and integrates with credit bureau APIs. Built with NestJS backend and React frontend.

## 🚀 Features

### Backend Services

- **Authentication**: JWT-based user registration and login with RBAC
- **CSV Processing**: Bank statement ingestion with transaction parsing
- **Financial Insights**: Automated analysis of spending patterns and risk assessment
- **Credit Bureau Integration**: Mock API with retry logic and error handling
- **RESTful APIs**: Comprehensive API endpoints with Swagger documentation

### Frontend Interface

- **Modern UI**: React-based interface with Tailwind CSS
- **Real-time Updates**: React Query for efficient data management
- **Interactive Charts**: Visual representation of financial data
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Drag & Drop**: Easy CSV file upload interface

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (NestJS)      │◄──►│   (MySQL)       │
│   Port: 3002    │    │   Port: 3000    │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  Mock Bureau    │
                       │     API         │
                       │   Port: 3001    │
                       └─────────────────┘
```

## 🛠️ Tech Stack

### Backend

- **Node.js** + **TypeScript**
- **NestJS** framework
- **MySQL** database with **TypeORM**
- **JWT** authentication
- **Swagger** API documentation
- **Jest** testing framework

### Frontend

- **React 18** + **TypeScript**
- **React Query** (TanStack Query)
- **Tailwind CSS** for styling
- **Chart.js** for data visualization
- **React Hook Form** for forms
- **React Router** for navigation

## 📋 Prerequisites

- **Docker** and **Docker Compose**
- **Node.js** 18+ (for local development)
- **MySQL** 8.0+ (if running locally)

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**:

```bash
git clone <repository-url>
cd Mini-Credit-Insights-Service
```

2. **Start all services**:

```bash
docker-compose up -d
```

3. **Access the services**:

- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:3000/api/v1
- **API Docs**: http://localhost:3000/api/v1/docs
- **Mock Bureau**: http://localhost:3001

### Option 2: Local Development

1. **Start the database**:

```bash
docker-compose up mysql -d
```

2. **Install backend dependencies**:

```bash
npm install
```

3. **Start the backend**:

```bash
npm run start:dev
```

4. **Install frontend dependencies**:

```bash
cd frontend
npm install
```

5. **Start the frontend**:

```bash
npm start
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

### Statement Management

- `POST /api/v1/statements/upload` - Upload CSV statement
- `GET /api/v1/statements` - Get user statements
- `GET /api/v1/statements/:id` - Get specific statement

### Financial Insights

- `POST /api/v1/insights/run` - Compute insights
- `GET /api/v1/insights` - Get user insights
- `GET /api/v1/insights/:id` - Get specific insight

### Credit Bureau

- `POST /api/v1/bureau/check` - Check credit
- `GET /api/v1/bureau` - Get bureau reports
- `GET /api/v1/bureau/:id` - Get specific report

### Health & Monitoring

- `GET /api/v1/health` - Health check
- `GET /api/v1/metrics` - Application metrics

## 🧪 Testing

### Backend Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📁 Project Structure

```
├── src/                    # Backend source code
│   ├── auth/              # Authentication module
│   ├── users/             # User management
│   ├── statements/        # Statement processing
│   ├── insights/          # Financial analysis
│   ├── bureau/            # Credit bureau integration
│   └── audit/             # Audit logging
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React Query hooks
│   │   ├── services/      # API service layer
│   │   └── types/         # TypeScript interfaces
│   └── public/            # Static assets
├── bureau-mock/           # Mock credit bureau API
├── docker-compose.yml     # Service orchestration
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables

#### Backend

```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=user
DB_PASSWORD=password
DB_DATABASE=credit_insights
JWT_SECRET=your-secret-key
BUREAU_API_URL=http://localhost:3001/v1/credit/check
BUREAU_API_KEY=mock-api-key-123
BUREAU_MAX_RETRIES=3
BUREAU_TIMEOUT=10000
```

#### Frontend

```env
REACT_APP_API_URL=http://localhost:3000/api/v1
```

## 📊 Data Models

### Core Entities

- **Users**: Authentication and role management
- **Statements**: Bank statement metadata
- **Transactions**: Individual financial transactions
- **Insights**: Computed financial analysis
- **Bureau Reports**: Credit bureau data
- **Audit Logs**: System activity tracking

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt
- **Input Validation** with class-validator
- **Rate Limiting** for API endpoints
- **CORS Configuration** for frontend integration
- **Security Headers** in nginx configuration

## 📈 Performance Features

- **Database Indexing** for optimal query performance
- **Query Caching** with React Query
- **File Upload Optimization** with streaming
- **Background Processing** for CSV parsing
- **Connection Pooling** for database connections

## 🚀 Deployment

### Production Build

```bash
# Backend
npm run build
docker build -t credit-insights-backend .

# Frontend
cd frontend
npm run build
docker build -t credit-insights-frontend .
```

### Environment Considerations

- Use strong JWT secrets
- Configure production database credentials
- Set up proper SSL/TLS certificates
- Configure monitoring and logging
- Set up backup strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Check the API documentation at `/api/v1/docs`
- Review the test files for usage examples
- Open an issue on the repository

## 🔄 Changelog

### v1.0.0

- Initial release with full backend and frontend
- Complete API implementation
- Modern React interface
- Docker containerization
- Comprehensive testing suite
