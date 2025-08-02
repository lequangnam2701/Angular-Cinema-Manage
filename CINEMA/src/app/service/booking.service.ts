import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Seat } from '../models/Seat.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private baseUrl = 'http://localhost:8001/api/bookings';

  constructor(private http: HttpClient) {}
  getAllSeatsWithStatus(showingTimeId: string): Observable<Seat[]> {
    const url = `${this.baseUrl}/seats/all?showingTimeId=${showingTimeId}`;

    return this.http.get<Seat[]>(url);
  }
}
