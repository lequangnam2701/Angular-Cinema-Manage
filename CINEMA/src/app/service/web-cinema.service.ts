import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cinema } from '../models/cinema.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {
  private apiUrl = 'http://localhost:8001/api/cinemas';

  constructor(private http: HttpClient) { }

  getCinemas(): Observable<Cinema[]> {
    return this.http.get<Cinema[]>(this.apiUrl);
  }
}