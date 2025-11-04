import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('clerk_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
  searchFields?: string[];
  filters?: Record<string, any>;
}

// Generic CRUD operations
export class BaseApiService<T> {
  constructor(private endpoint: string) {}

  async getAll(params?: QueryParams): Promise<PaginatedResponse<T>> {
    const response = await apiClient.get(this.endpoint, { params });
    return response.data;
  }

  async getOne(id: string): Promise<T> {
    const response = await apiClient.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(data: Partial<T>): Promise<T> {
    const response = await apiClient.post(this.endpoint, data);
    return response.data;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const response = await apiClient.put(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`);
  }
}

// Specific services
export const userService = new BaseApiService('/users');
export const roleService = new BaseApiService('/roles');
export const groupService = new BaseApiService('/groups');
export const permissionService = new BaseApiService('/permissions');
export const approvalService = new BaseApiService('/approvals');
export const patternService = new BaseApiService('/patterns');
export const exceptionService = new BaseApiService('/exceptions');
export const claimService = new BaseApiService('/claims');
export const decisionService = new BaseApiService('/decisions');

// Audit log service
export const auditLogService = {
  async getEntityTimeline(entityType: string, entityId: string) {
    const response = await apiClient.get(`/audit-logs/timeline/${entityType}/${entityId}`);
    return response.data;
  },
  async getAll(params?: QueryParams) {
    const response = await apiClient.get('/audit-logs', { params });
    return response.data;
  },
};
