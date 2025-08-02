import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User, CreateUserRequest, UpdateUserRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8001/api/users';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

 
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  
  searchUsers(keyword: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/search?keyword=${keyword}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  createUser(user: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl, user, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(user: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

 
  hasAdminPermission(): boolean {
    const userRole = localStorage.getItem('userRole');
    return userRole === 'ADMIN';
  }

 
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 401:
          errorMessage = 'Unauthorized. Please login again.';
          // Optionally redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          break;
        case 403:
          errorMessage = 'Access forbidden. You don\'t have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 500:
          errorMessage = 'Internal server error.';
          break;
        default:
          errorMessage = error.error?.message || `Error Code: ${error.status}`;
      }
    }
    
    console.error('HTTP Error:', error);
    return throwError(() => errorMessage);
  }
}