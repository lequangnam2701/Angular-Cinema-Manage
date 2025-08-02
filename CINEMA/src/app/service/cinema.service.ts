import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { 
  Cinema, 
  CreateCinemaRequest, 
  UpdateCinemaRequest,
  CinemaResponse,
  CinemaListResponse 
} from '../models/cinema.interface';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {
    private readonly apiUrl = 'http://localhost:8001/api/cinemas';

    private readonly httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        })
    };
  constructor(private http: HttpClient) { }

  getAllCinemas(): Observable<Cinema[]> {
    return this.http.get<Cinema[]>(this.apiUrl)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getCinemaById(id: number): Observable<Cinema> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Cinema>(url)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

   createCinema(cinemaData: CreateCinemaRequest): Observable<Cinema> {
    return this.http.post<Cinema>(this.apiUrl, cinemaData, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

   updateCinema(id: number, cinemaData: UpdateCinemaRequest): Observable<Cinema> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Cinema>(url, cinemaData, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

   deleteCinema(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

    checkCinemaExists(id: number): Observable<boolean> {
  return this.getCinemaById(id).pipe(
    map(() => true), 
    catchError(() => of(false)) 
  );
}

   searchCinemasByName(name: string): Observable<Cinema[]> {
    const url = `${this.apiUrl}/search?name=${encodeURIComponent(name)}`;
    return this.http.get<Cinema[]>(url)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

   getCinemasByState(stateId: number): Observable<Cinema[]> {
    const url = `${this.apiUrl}/state/${stateId}`;
    return this.http.get<Cinema[]>(url)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

   private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
     
      switch (error.status) {
        case 400:
          errorMessage = 'Bad Request - Invalid data provided';
          break;
        case 401:
          errorMessage = 'Unauthorized - Authentication required';
          break;
        case 403:
          errorMessage = 'Forbidden - Access denied';
          break;
        case 404:
          errorMessage = 'Not Found - Cinema not found';
          break;
        case 409:
          errorMessage = 'Conflict - Cinema already exists';
          break;
        case 500:
          errorMessage = 'Internal Server Error';
          break;
        default:
          errorMessage = `Server Error: ${error.status} - ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));

    }

};

  
