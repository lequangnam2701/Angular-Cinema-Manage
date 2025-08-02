import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ShowingTime } from '../models/buyTicketMovie.interface';

@Injectable({
  providedIn: 'root',
})
export class ShowingTimesService {
  private apiUrl = 'http://localhost:8001/api/showing-times';

  constructor(private http: HttpClient) {}

  getShowingTimes(): Observable<ShowingTime[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((data) =>
        data.map((item) => ({
          id: item.id,
          dateTime: item.dateTime,
          movieTitle: item.movieTitle,
          runtimeMin: item.runtimeMin,
          genre: item.genre,
          director: item.director,
          actor: item.actor,
          poster: item.poster,
          description: item.description,
          movieId: item.movieId,
          cinemaId: item.cinemaId,
          cinemaName: item.cinemaName,
        }))
      )
    );
  }
}
