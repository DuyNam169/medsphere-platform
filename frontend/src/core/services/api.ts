import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AppConfig } from '../config/app.config';
import { storage, TOKEN_KEY } from '../utils/storage';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: AppConfig.apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        const token = storage.get(TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

  this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const requestUrl: string = error.config?.url ?? '';

        // Các endpoint public: gọi khi CHƯA đăng nhập, nên lỗi 401 ở đây
        // nghĩa là "sai thông tin", KHÔNG phải "phiên hết hạn".
        // Không được tự động redirect / xóa token trong các trường hợp này.
        const isPublicAuthEndpoint =
          requestUrl.includes('/v1/auth/login') ||
          requestUrl.includes('/v1/auth/register') ||
          requestUrl.includes('/v1/auth/google-login') ||
          requestUrl.includes('/v1/auth/refresh') ||
          requestUrl.includes('/v1/auth/forgot-password');

        if (error.response?.status === 401 && !isPublicAuthEndpoint) {
          storage.remove(TOKEN_KEY);
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<{ success: boolean; data: T; error?: { code: string; message: string } }> =
      await this.client.get(url, config);
    return response.data.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<{ success: boolean; data: T; error?: { code: string; message: string } }> =
      await this.client.post(url, data, config);
    return response.data.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<{ success: boolean; data: T; error?: { code: string; message: string } }> =
      await this.client.put(url, data, config);
    return response.data.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<{ success: boolean; data: T; error?: { code: string; message: string } }> =
      await this.client.delete(url, config);
    return response.data.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<{ success: boolean; data: T; error?: { code: string; message: string } }> =
      await this.client.patch(url, data, config);
    return response.data.data;
  }
}

export const apiService = new ApiService();
