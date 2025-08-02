import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import {
  ShowingTime,
  Movie,
  Cinema,
  CombinedData,
  Feature,
} from '../models/showing-time.interface';

@Injectable({
  providedIn: 'root',
})
export class ShowingTimesService {
  private apiUrl = 'http://localhost:8001/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getShowingTimes(): Observable<ShowingTime[]> {
    return this.http.get<ShowingTime[]>(`${this.apiUrl}/showing-times`);
  }

  getShowingTimeById(id: number) {
    return this.http.get<ShowingTime>(`${this.apiUrl}/showing-times/${id}`);
  }

  createShowingTime(showingTime: ShowingTime) {
    return this.http.post<ShowingTime>(
      `${this.apiUrl}/showing-times`,
      showingTime,
      this.httpOptions
    );
  }

  deleteShowingTime(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/showing-times/${id}`);
  }

  // Lấy danh sách phim
  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/movies`);
  }

  // Lấy danh sách rạp
  getCinemas(): Observable<Cinema[]> {
    return this.http.get<Cinema[]>(`${this.apiUrl}/cinemas`);
  }

  // Lấy danh sách MinimalFeatures
  getMinimalFeatures(): Observable<Feature[]> {
    return this.http.get<Feature[]>(`${this.apiUrl}/features`);
  }

  // Lấy tất cả dữ liệu cùng một lúc
  getAllData(): Observable<CombinedData> {
    return forkJoin({
      movies: this.getMovies(),
      cinemas: this.getCinemas(),
      Feature: this.getMinimalFeatures(),
    });
  }

  // Lấy chỉ tên của movies, cinemas, MinimalFeatures
  getNames(): Observable<{
    movieNames: string[];
    cinemaNames: string[];
    MinimalFeatureNames: string[];
  }> {
    return this.getAllData().pipe(
      map((data) => ({
        movieNames: data.movies.map((movie) => movie.title),
        cinemaNames: data.cinemas.map((cinema) => cinema.name),
        MinimalFeatureNames: data.Feature.map((f) => f.name),
      }))
    );
  }
}
