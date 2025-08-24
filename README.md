# Mini Credit Insights Service

A comprehensive financial insights platform that helps users analyze their spending patterns, check credit scores, and get personalized financial recommendations. Built with modern web technologies and a focus on user experience.

## 🎯 What This Project Does

Think of this as your personal financial dashboard - it's like having a financial advisor in your pocket. You can:

- **Upload bank statements** and get instant insights into your spending habits
- **Check your credit score** through our secure credit bureau integration
- **Track financial trends** over time with beautiful charts and analytics
- **Get personalized recommendations** to improve your financial health
- **Manage everything securely** with role-based access control

## 🏗️ How It's Built

I went with a modern, scalable architecture that's easy to maintain and extend:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                        │
│  • Beautiful, responsive UI with Tailwind CSS                 │
│  • Real-time data updates with React Query                    │
│  • Secure authentication and role-based navigation            │
├─────────────────────────────────────────────────────────────────┤
│                        Backend (NestJS)                       │
│  • Clean, modular architecture                                │
│  • JWT authentication with role-based access                  │
│  • Comprehensive API with Swagger documentation               │
├─────────────────────────────────────────────────────────────────┤
│                    External Services                            │
│  • Custom mock credit bureau API                              │
│  • MySQL database with TypeORM                                │
│  • Docker containerization for easy deployment               │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Key Features

### 🔐 **Smart Authentication System**

- **JWT-based login** that keeps you signed in securely
- **Role-based access** - regular users and admins see different things
- **Automatic admin creation** - no need to manually set up admin accounts
- **Secure password handling** with bcrypt encryption

### 📊 **Financial Data Processing**

- **CSV statement parsing** that handles real bank statement formats
- **Smart transaction categorization** to understand your spending
- **Data validation** to catch errors before they cause problems
- **Batch processing** for large files without timeouts

### 🧠 **Intelligent Financial Analysis**

- **Spending pattern recognition** - see where your money really goes
- **Trend analysis** - understand your financial habits over time
- **Risk assessment** - identify potential financial issues early
- **Personalized recommendations** - get actionable advice

### 🏦 **Credit Bureau Integration**

- **Real-time credit checks** through our secure API
- **Comprehensive credit data** - scores, risk bands, defaults, loans
- **Mock service for testing** - perfect for development and demos
- **Retry logic** - handles network issues gracefully

### 👥 **Admin Dashboard**

- **User management** - create, edit, and manage user accounts
- **System overview** - see all users' data at a glance
- **Audit logging** - track all system activities for security
- **Credit check access** - admins can run checks for any user

## 🛠️ Technology Stack

### **Frontend**

- **React 18** with TypeScript for type safety
- **Tailwind CSS** for beautiful, responsive design
- **React Query** for efficient data fetching and caching
- **React Router** for smooth navigation
- **Lucide React** for crisp, modern icons

### **Backend**

- **NestJS** with TypeScript for robust API development
- **TypeORM** for database operations and migrations
- **JWT** for secure authentication
- **Class-validator** for input validation
- **Swagger** for API documentation

### **Infrastructure**

- **Docker & Docker Compose** for easy deployment
- **MySQL 8.0** for reliable data storage
- **Custom mock services** for development and testing

## 🏦 Mock Credit Bureau API

I built a realistic mock credit bureau service that mimics real-world behavior:

### **What It Does**

- **Simulates real API responses** with realistic credit scores (300-600 range)
- **Handles authentication** with API key validation
- **Simulates network delays** (0.5-2.5 seconds) like real services
- **Generates varied responses** - different risk bands, enquiry counts, etc.
- **Error simulation** - tests how your app handles failures

### **API Endpoints**

```http
POST /v1/credit/check
Headers: X-API-Key: test-api-key
Body: { firstName, lastName, dateOfBirth, ssn }

Response: {
  "score": 485,
  "risk_band": "Fair",
  "enquiries_6m": 3,
  "defaults": 0,
  "open_loans": 2,
  "trade_lines": 8
}
```

### **Safety Features**

- **Demo-only warnings** throughout the interface
- **Mock data placeholders** - never asks for real information
- **One-click demo data** button for easy testing
- **Clear labeling** that this is for testing purposes

## 📱 User Experience

### **For Regular Users**

- **Dashboard overview** of your financial health
- **Easy statement uploads** with drag-and-drop
- **Credit check access** right from the dashboard
- **Beautiful charts** showing your spending patterns
- **Mobile-responsive** design that works everywhere

### **For Admins**

- **Comprehensive user management** interface
- **System-wide insights** - see all users' data
- **Credit check capabilities** for any user
- **Audit trail** of all system activities
- **Performance monitoring** and health checks

## 🚀 Getting Started

### **Quick Start (Docker)**

```bash
# Clone the repository
git clone https://github.com/yourusername/Mini-Credit-Insights-Service.git
cd Mini-Credit-Insights-Service

# Start everything with Docker
docker-compose up --build

# Access the application
Frontend: http://localhost:3002
Backend: http://localhost:3000
Mock Bureau: http://localhost:4000
```

### **Default Admin Account**

- **Username:** `admin`
- **Password:** `admin123`
- **Note:** This is automatically created on first run

### **Local Development**

```bash
# Install dependencies
npm install

# Start backend
npm run start:dev

# Start frontend (in another terminal)
cd frontend
npm install
npm start

# Run tests
npm test
```

## 📋 API Reference

### **Authentication**

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
```

### **User Management (Admin Only)**

```http
GET    /api/v1/admin/users
POST   /api/v1/admin/users
GET    /api/v1/admin/users/:id
PUT    /api/v1/admin/users/:id
DELETE /api/v1/admin/users/:id
```

### **Financial Data**

```http
POST   /api/v1/statements/upload
GET    /api/v1/statements
POST   /api/v1/insights/run
GET    /api/v1/insights
```

### **Credit Bureau**

```http
POST /api/v1/bureau/check
GET  /api/v1/bureau/reports
```

## 🔧 Configuration

### **Environment Variables**

```env
# Database
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=credit_user
DB_PASSWORD=credit_password
DB_DATABASE=credit_insights

# Security
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Credit Bureau
BUREAU_API_URL=http://bureau-mock:4000/v1/credit/check
BUREAU_API_KEY=test-api-key
```

## 🧪 Testing

The project includes comprehensive testing:

```bash
# Run all tests
npm test

# Test with coverage
npm run test:cov

# Test specific modules
npm test -- --testPathPattern=auth
```

## 🔒 Security Features

- **JWT authentication** with secure token handling
- **Role-based access control** - users only see their own data
- **Input validation** throughout the application
- **Audit logging** for security and compliance
- **Demo-only interfaces** - never collects real personal data
- **Secure error handling** - no information leakage

## 🚀 Deployment

### **Production Checklist**

- [ ] Change default admin credentials
- [ ] Use strong, unique JWT secrets
- [ ] Enable HTTPS with proper certificates
- [ ] Set up database backups
- [ ] Configure monitoring and alerting
- [ ] Set appropriate rate limits

### **Docker Deployment**

```bash
# Build and start
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🤝 Contributing

This project was built as a technical assessment, but if you want to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is for demonstration purposes. Feel free to use it as a reference for your own projects.

---

**Built with ❤️ using modern web technologies. Perfect for learning NestJS, React, and financial application development.**

GitHub: [Mini-Credit-Insights-Service](https://github.com/tobidun/Mini-Credit-Insights-Service)
