import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeatureType } from '../models/feature-types.interface';

@Injectable({
  providedIn: 'root'
})
export class FeatureTypeService {
  private apiUrl = 'http://localhost:8001/api/feature-types';

  constructor(private http: HttpClient) {}

  getFeatureType(): Observable<FeatureType[]> {
    return this.http.get<FeatureType[]>(this.apiUrl);
  }

  getFeatureTypeById(id: number): Observable<FeatureType> {
    return this.http.get<FeatureType>(`${this.apiUrl}/${id}`);
  }

  createFeatureType(FeatureType: Omit<FeatureType, 'id'>): Observable<FeatureType> {
    return this.http.post<FeatureType>(this.apiUrl, FeatureType);
  }

  updateFeatureType(id: number, FeatureType: Partial<FeatureType>): Observable<FeatureType> {
    return this.http.put<FeatureType>(`${this.apiUrl}/${id}`, FeatureType);
  }

  deleteFeatureType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}