import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Movie } from '../models/movie.interface';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiUrl = 'http://localhost:8001/api/movies';

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http
      .get<Movie[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http
      .get<Movie>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createMovie(formData: FormData): Observable<Movie> {
    return this.http
      .post<Movie>(this.apiUrl, formData)
      .pipe(catchError(this.handleError));
  }

  updateMovie(id: number, movie: Movie): Observable<Movie> {
    return this.http
      .put<Movie>(`${this.apiUrl}/${id}`, movie)
      .pipe(catchError(this.handleError));
  }

  deleteMovie(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Có lỗi xảy ra!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      errorMessage = `Mã lỗi: ${error.status}\nThông điệp: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
