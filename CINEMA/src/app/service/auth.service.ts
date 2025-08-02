import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  roleName: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8001/api/auth';

  constructor(private http: HttpClient) {}

  async loginUser(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.http
        .post<LoginResponse>(`${this.apiUrl}/login`, credentials)
        .toPromise();

      if (!response) {
        throw new Error('No response received');
      }

      localStorage.setItem('token', response.token);
      localStorage.setItem('username', response.username);

      if (response.roleName) {
        localStorage.setItem('userRole', response.roleName);
      }

      return response;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        throw new Error(error.error?.message || 'Login failed');
      } else {
        throw new Error('An unexpected error occurred');
      }
    }
  }

  // Optional: Add other auth methods
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }
}
