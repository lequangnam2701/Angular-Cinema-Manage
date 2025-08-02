import { Injectable } from '@angular/core';
import { Snack } from '../models/snack.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SnacksService {
  private apiUrl = 'http://localhost:8001/api/snacks';

  constructor(private http: HttpClient) { }

  getSnacks(): Observable<Snack[]> {
    return this.http.get<Snack[]>(this.apiUrl);
  }
}

