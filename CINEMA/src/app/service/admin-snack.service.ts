import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Snack } from "../models/snack.interface";
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class SnacksService {
  private apiUrl = 'http://localhost:8001/api/snacks';
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // GET - Fetch all snacks
  getSnacks(): Observable<Snack[]> {
    return this.http.get<Snack[]>(this.apiUrl);
  }

//   // GET - Fetch single snack by ID
//   getSnack(id: number): Observable<Snack> {
//     return this.http.get<Snack>(`${this.apiUrl}/${id}`);
//   }

  // POST - Create new snack
  createSnack(snack: Snack): Observable<Snack> {
    return this.http.post<Snack>(this.apiUrl, snack, this.httpOptions);
  }

  // PUT - Update existing snack
  updateSnack(id: number, snack: Snack): Observable<Snack> {
    return this.http.put<Snack>(`${this.apiUrl}/${id}`, snack, this.httpOptions);
  }

  // DELETE - Delete snack by ID
  deleteSnack(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.httpOptions);
  }
}
