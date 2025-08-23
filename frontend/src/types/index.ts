export interface User {
  id: number;
  username: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface Statement {
  id: number;
  userId: number;
  filename: string;
  uploadDate: string;
  status: "processing" | "completed" | "failed";
  parsingSuccessRate: number;
  totalTransactions: number;
  transactions?: Transaction[];
  user?: User;
}

export interface Transaction {
  id: number;
  statementId: number;
  description: string;
  amount: number;
  transactionDate: string;
  balance: number;
  statement?: Statement;
}

export interface Insight {
  id: number;
  statementId: number;
  userId: number;
  threeMonthAvgIncome: number;
  totalInflow: number;
  totalOutflow: number;
  netAmount: number;
  spendBuckets: Record<string, number>;
  riskFlags: string[];
  generatedAt: string;
  statement?: Statement;
  user?: User;
}

export interface BureauReport {
  id: number;
  userId: number;
  status: "pending" | "completed" | "failed";
  creditScore: number | null;
  riskBand: string | null;
  enquiries6m: number | null;
  defaults: number | null;
  openLoans: number | null;
  tradeLines: number | null;
  errorMessage: string | null;
  requestedAt: string;
  user?: User;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}

export interface StatementUploadResponse {
  id: number;
  status: string;
  totalTransactions: number;
  parsingSuccessRate: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
