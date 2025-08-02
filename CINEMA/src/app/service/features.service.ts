import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Feature } from '../models/features.interface';

@Injectable({
  providedIn: 'root',
})
export class FeaturesService {
  private apiUrl = 'http://localhost:8001/api/features';

  constructor(private http: HttpClient) {}

  
  getFeatures(): Observable<Feature[]> {
    return this.http
      .get<Feature[]>(this.apiUrl)
      .pipe(retry(2), catchError(this.handleError));
  }


  deleteFeature(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

 
  addFeature(feature: Omit<Feature, 'id'>): Observable<Feature> {
    return this.http
      .post<Feature>(this.apiUrl, feature)
      .pipe(catchError(this.handleError));
  }

  // Cập nhật feature
  updateFeature(id: number, feature: Partial<Feature>): Observable<Feature> {
    return this.http
      .put<Feature>(`${this.apiUrl}/${id}`, feature)
      .pipe(catchError(this.handleError));
  }

  // Xử lý lỗi
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Đã xảy ra lỗi không xác định';

    if (error.error instanceof ErrorEvent) {
      // Lỗi phía client
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      // Lỗi phía server
      errorMessage = `Mã lỗi: ${error.status}\nThông báo: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
