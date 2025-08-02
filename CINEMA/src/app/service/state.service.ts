import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { State } from '../models/state.interface';

@Injectable({
  providedIn: 'root',
})
export class StatesService {
  private apiUrl = 'http://localhost:8001/api/states';

  constructor(private http: HttpClient) {}

  getStates(): Observable<State[]> {
    return this.http.get<State[]>(this.apiUrl);
  }

  getStateById(id: number): Observable<State> {
    return this.http.get<State>(`${this.apiUrl}/${id}`);
  }

  createState(state: Omit<State, 'id'>): Observable<State> {
    return this.http.post<State>(this.apiUrl, state);
  }

  updateState(id: number, state: Partial<State>): Observable<State> {
    return this.http.put<State>(`${this.apiUrl}/${id}`, state);
  }

  deleteState(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
