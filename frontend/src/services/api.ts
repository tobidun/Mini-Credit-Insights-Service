import axios, { AxiosInstance, AxiosResponse } from "axios";
import { AuthResponse, LoginRequest, RegisterRequest } from "../types";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000/api/v1";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>(
      "/auth/register",
      userData
    );
    return response.data;
  }

  // Statements endpoints
  async uploadStatement(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.api.post("/statements/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async getStatements(): Promise<any[]> {
    const response = await this.api.get("/statements");
    return response.data;
  }

  async getStatement(id: number): Promise<any> {
    const response = await this.api.get(`/statements/${id}`);
    return response.data;
  }

  // Insights endpoints
  async computeInsights(statementId: number): Promise<any> {
    const response = await this.api.post("/insights/run", { statementId });
    return response.data;
  }

  async getInsights(): Promise<any[]> {
    const response = await this.api.get("/insights");
    return response.data;
  }

  async getInsight(id: number): Promise<any> {
    const response = await this.api.get(`/insights/${id}`);
    return response.data;
  }

  // Bureau endpoints
  async checkCredit(): Promise<any> {
    const response = await this.api.post("/bureau/check");
    return response.data;
  }

  async getBureauReports(): Promise<any[]> {
    const response = await this.api.get("/bureau/reports");
    return response.data;
  }

  async getBureauReport(id: number): Promise<any> {
    const response = await this.api.get(`/bureau/reports/${id}`);
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<any> {
    const response = await this.api.get("/health");
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
