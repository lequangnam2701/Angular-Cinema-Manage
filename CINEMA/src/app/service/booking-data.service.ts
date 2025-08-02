import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Seat } from '../models/Seat.interface';
import { SelectedSnackItem } from '../models/snack.interface';
import { SummaryMovieDetails } from '../models/SummaryMovieDetails.interface';

@Injectable({
  providedIn: 'root',
})
export class BookingDataService {
  private selectedSeatsSubject = new BehaviorSubject<Seat[]>([]);
  private selectedSnacksMapSubject = new BehaviorSubject<
    Map<string, SelectedSnackItem>
  >(new Map());
  private movieDetailsSubject = new BehaviorSubject<SummaryMovieDetails | null>(
    null
  );
  private bookingIdSubject = new BehaviorSubject<number | null>(null);

  selectedSeats$ = this.selectedSeatsSubject.asObservable();
  selectedSnacksMap$ = this.selectedSnacksMapSubject.asObservable();
  movieDetails$ = this.movieDetailsSubject.asObservable();
  bookingId$ = this.bookingIdSubject.asObservable();

  constructor() {
    this.movieDetails$.subscribe((details) => {
      if (details) {
      }
    });
  }

  setSelectedSeats(seats: Seat[]): void {
    this.selectedSeatsSubject.next(seats);
  }

  getSelectedSeats(): Seat[] {
    return this.selectedSeatsSubject.value;
  }

  setSelectedSnacksMap(snacksMap: Map<string, SelectedSnackItem>): void {
    this.selectedSnacksMapSubject.next(snacksMap);
  }

  getSelectedSnacksMap(): Map<string, SelectedSnackItem> {
    return this.selectedSnacksMapSubject.value;
  }

  setSummaryMovieDetails(details: SummaryMovieDetails): void {
    const currentDetails = this.movieDetailsSubject.value;

  
    const mergedDetails: SummaryMovieDetails = {
      ...(currentDetails || {}),
      ...details,
      cinema: details.cinema || currentDetails?.cinema || '',
      cinemaId: details.cinemaId || currentDetails?.cinemaId || '',
    };
    this.movieDetailsSubject.next(mergedDetails);
  }

  getCurrentMovieDetails(): SummaryMovieDetails | null {
    const current = this.movieDetailsSubject.value;
    return current;
  }

  setBookingId(bookingId: number): void {
    this.bookingIdSubject.next(bookingId);
  }

  getBookingId(): number | null {
    return this.bookingIdSubject.value;
  }

  updateCinemaInfo(cinemaName: string, cinemaId: string): void {
   
    const currentDetails = this.movieDetailsSubject.value;

    const updatedDetails: SummaryMovieDetails = {
      movieId: currentDetails?.movieId || '',
      title: currentDetails?.title || '',
      runtime: currentDetails?.runtime || '',
      showtime: currentDetails?.showtime || '',
      showtimeId: currentDetails?.showtimeId || '',
      cinema: cinemaName,
      cinemaId: cinemaId,
    };

    this.movieDetailsSubject.next(updatedDetails);
  }

  updateMovieInfo(
    movieId: string,
    title: string,
    runtime: string,
    showtime: string,
    showtimeId: string
  ): void {

    const currentDetails = this.movieDetailsSubject.value;

    const updatedDetails: SummaryMovieDetails = {
      movieId: movieId,
      title: title,
      runtime: runtime,
      showtime: showtime,
      showtimeId: showtimeId,
      cinema: currentDetails?.cinema || '',
      cinemaId: currentDetails?.cinemaId || '',
    };

    this.movieDetailsSubject.next(updatedDetails);
  }

  updateMovieDetailsField(field: keyof SummaryMovieDetails, value: any): void {
    const currentDetails = this.movieDetailsSubject.value;
    if (currentDetails) {
      const updatedDetails = {
        ...currentDetails,
        [field]: value,
      };
      this.movieDetailsSubject.next(updatedDetails);
    } else {
    }
  }

  // clearAllData(): void {
   
  //   this.selectedSeatsSubject.next([]);
  //   this.selectedSnacksMapSubject.next(new Map());
  //   this.movieDetailsSubject.next(null);
  //   this.bookingIdSubject.next(null);
  // }

  forceCinemaInfo(cinemaName: string, cinemaId: string): void {
   
    const currentDetails = this.movieDetailsSubject.value;

    if (currentDetails) {
      currentDetails.cinema = cinemaName;
      currentDetails.cinemaId = cinemaId;
      this.movieDetailsSubject.next({ ...currentDetails });
     
    }
  }

    clearAllData(): void {
    this.selectedSeatsSubject.next([]);
    this.selectedSnacksMapSubject.next(new Map());
    this.movieDetailsSubject.next(null);
    this.bookingIdSubject.next(null);
    
    sessionStorage.removeItem('selectedCinemaName');
    sessionStorage.removeItem('selectedCinemaId');
    
    console.log('All booking data cleared after successful payment');
  }
}
