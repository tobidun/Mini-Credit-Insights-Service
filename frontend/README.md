# Credit Insights Frontend

A modern React-based frontend application for the Credit Insights Service, providing an intuitive interface for managing bank statements, analyzing financial insights, and monitoring credit bureau information.

## Features

- **Authentication**: Secure login and registration with JWT tokens
- **Dashboard**: Overview of all financial data with key metrics
- **Statement Management**: Upload and manage CSV bank statements
- **Financial Insights**: Visual analysis of spending patterns and risk assessment
- **Credit Bureau**: Check credit scores and monitor bureau reports
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: React Query for efficient data fetching and caching

## Tech Stack

- **React 18** with TypeScript
- **React Query (TanStack Query)** for server state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **Chart.js** for data visualization
- **Heroicons** for icons
- **Axios** for HTTP requests

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Backend service running on `http://localhost:3000`

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

3. Open [http://localhost:3001](http://localhost:3001) in your browser

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with navigation
│   └── ProtectedRoute.tsx # Authentication guard
├── hooks/              # Custom React Query hooks
│   ├── useAuth.ts      # Authentication operations
│   ├── useStatements.ts # Statement management
│   ├── useInsights.ts  # Financial insights
│   └── useBureau.ts    # Credit bureau operations
├── pages/              # Page components
│   ├── LoginPage.tsx   # User authentication
│   ├── RegisterPage.tsx # User registration
│   ├── DashboardPage.tsx # Main dashboard
│   ├── StatementsPage.tsx # Statement management
│   ├── InsightsPage.tsx # Financial analysis
│   └── BureauPage.tsx  # Credit bureau
├── services/           # API service layer
│   └── api.ts         # HTTP client configuration
├── types/              # TypeScript interfaces
│   └── index.ts       # All type definitions
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## API Integration

The frontend integrates with the Credit Insights Service backend through:

- **Base URL**: `http://localhost:3000/api/v1`
- **Authentication**: JWT Bearer tokens
- **File Upload**: Multipart form data for CSV statements
- **Real-time Updates**: Automatic data refetching with React Query

## Key Components

### Authentication Flow

- JWT-based authentication with automatic token refresh
- Protected routes for authenticated users
- Automatic redirect on authentication errors

### Statement Management

- Drag-and-drop CSV file upload
- Real-time processing status updates
- Transaction parsing success rate monitoring

### Financial Insights

- Interactive charts for spending categories
- Risk assessment with visual indicators
- 3-month income averaging calculations

### Credit Bureau Integration

- Credit score monitoring with color-coded indicators
- Risk band classification
- Comprehensive credit report details

## Styling

The application uses Tailwind CSS with a custom design system:

- **Primary Colors**: Blue-based palette for main actions
- **Success Colors**: Green for positive indicators
- **Warning Colors**: Yellow/Orange for caution states
- **Danger Colors**: Red for error states
- **Responsive Grid**: Mobile-first responsive design

## State Management

- **React Query**: Server state management with caching
- **Local Storage**: User authentication persistence
- **React State**: Local component state management

## Performance Features

- **Query Caching**: Intelligent data caching with React Query
- **Lazy Loading**: Component-based code splitting
- **Optimistic Updates**: Immediate UI feedback for better UX
- **Background Refetching**: Automatic data synchronization

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App

### Environment Variables

- `REACT_APP_API_URL` - Backend API URL (defaults to localhost:3000)

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new components
3. Implement proper error handling
4. Add appropriate loading states
5. Test on multiple screen sizes

## License

This project is part of the Credit Insights Service and follows the same licensing terms.
