import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Theatre } from '../models/theatres.interface';

@Injectable({
  providedIn: 'root'
})
export class TheatreService {
  private apiUrl = 'http://localhost:8001/api/theatres';

  constructor(private http: HttpClient) {}

  getTheatres(): Observable<Theatre[]> {
    return this.http.get<Theatre[]>(this.apiUrl);
  }

  getTheatreById(id: number): Observable<Theatre> {
    return this.http.get<Theatre>(`${this.apiUrl}/${id}`);
  }

  getTheatresByCinema(cinemaId: number): Observable<Theatre[]> {
    return this.http.get<Theatre[]>(`${this.apiUrl}?cinemaId=${cinemaId}`);
  }

  createTheatre(theatre: Omit<Theatre, 'id'>): Observable<Theatre> {
    return this.http.post<Theatre>(this.apiUrl, theatre);
  }

  updateTheatre(id: number, theatre: Partial<Theatre>): Observable<Theatre> {
    return this.http.put<Theatre>(`${this.apiUrl}/${id}`, theatre);
  }

  deleteTheatre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}