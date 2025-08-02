import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShowingTime } from '../../../models/buyTicketMovie.interface';
import { ShowingTimesService } from '../../../service/buyTicketMovie.service';
import { Movie } from '../../../models/movie.interface';
import { BookingDataService } from '../../../service/booking-data.service';
import { SummaryMovieDetails } from '../../../models/SummaryMovieDetails.interface';

@Component({
  selector: 'app-buy-ticket-movie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buy-ticket-movie.component.html',
  styleUrl: './buy-ticket-movie.component.css',
})
export class BuyTicketMovieComponent implements OnInit {
  loading = true;
  error: string | null = null;
  showingTimes: ShowingTime[] = [];
  availableDates: string[] = [];
  filteredShowings: ShowingTime[] = [];
  selectedDateIndex = 0;

  private _movieData: {
    poster?: string;
    title?: string;
    duration?: number;
    description?: string;
    director?: string;
    actor?: string;
    genre?: string;
  } = {};

  constructor(
    private showingTimesService: ShowingTimesService,
    private router: Router,
    private route: ActivatedRoute,
    private bookingDataService: BookingDataService
  ) {}

  ngOnInit(): void {

    this.getMovieDataFromNavigation();
    this.loadShowingTimes();
  }

  formatRuntime(runtimeMin: number): string {
    const hours = Math.floor(runtimeMin / 60);
    const minutes = runtimeMin % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  private reloadPageIfNeeded(): void {
    const hasReloaded = sessionStorage.getItem('buyTicketPageReloaded');

    if (!hasReloaded) {
      sessionStorage.setItem('buyTicketPageReloaded', 'true');
      // window.location.reload();
      return;
    }

    window.addEventListener('beforeunload', () => {
      sessionStorage.removeItem('buyTicketPageReloaded');
    });
  }

  private getMovieDataFromNavigation(): void {
    try {
      const navigation = this.router.getCurrentNavigation?.();
      if (navigation?.extras.state?.['movieData']) {
        this.setMovieData(navigation.extras.state['movieData']);
        return;
      }
    } catch (error) {}

    const state = window.history.state;
    if (state?.movieData) {
      this.setMovieData(state.movieData);
      return;
    }
    if (this.router.getCurrentNavigation?.()?.extras?.state) {
      const routeState = this.router.getCurrentNavigation()?.extras?.state;
      if (routeState?.['movieData']) {
        this.setMovieData(routeState['movieData']);
        return;
      }
    }

    this.route.queryParams.subscribe((params) => {
      if (params['title']) {
        this._movieData = {
          title: params['title'],
          poster: params['poster'] || '',
          duration: parseInt(params['runtime']) || 0,
          description: params['description'] || '',
          director: params['director'] || '',
          actor: params['actor'] || '',
          genre: params['genre'] || '',
        };
      }
    });

    const movieId = this.route.snapshot.paramMap.get('id');
    if (movieId && !this._movieData.title) {
    }
  }

  private setMovieData(movieData: any): void {
    this._movieData = {
      poster: movieData.posterImage || movieData.poster || '',
      title: movieData.title || '',
      duration: movieData.runtimeMin || movieData.runtime || 0,
      description: movieData.description || '',
      director: movieData.director || '',
      actor: movieData.actor || '',
      genre: movieData.genre || '',
    };
  }

  loadShowingTimes(): void {
    this.loading = true;
    this.error = null;

    this.showingTimesService.getShowingTimes().subscribe({
      next: (data) => {
        this.showingTimes = data.filter(
          (showing) => showing.movieTitle === this.movieTitle
        );

        this.processAvailableDates();
        this.selectDate(0);
        this.loading = false;
      },
      error: (err) => {
        this.error =
          'Không thể tải thông tin suất chiếu. Vui lòng thử lại sau.';
        this.loading = false;
      },
    });
  }

  processAvailableDates(): void {
    const uniqueDates = [
      ...new Set(
        this.showingTimes.map((showing) => {
          const date = new Date(showing.dateTime);
          return date.toDateString();
        })
      ),
    ].sort();

    this.availableDates = uniqueDates;
  }

  selectDate(index: number): void {
    this.selectedDateIndex = index;
    if (index >= 0 && index < this.availableDates.length) {
      const selectedDate = this.availableDates[index];
      this.filteredShowings = this.showingTimes.filter((showing) => {
        const showingDate = new Date(showing.dateTime);
        return showingDate.toDateString() === selectedDate;
      });
    }
  }

  formatDateNumber(dateString: string): string {
    const date = new Date(dateString);
    return (
      date.getDate().toString().padStart(2, '0') +
      '/' +
      (date.getMonth() + 1).toString().padStart(2, '0')
    );
  }

  formatDayName(dateString: string): string {
    const date = new Date(dateString);
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[date.getDay()];
  }
  get currentMovie(): ShowingTime | null {
    if (this.filteredShowings.length > 0) {
      return this.filteredShowings[0];
    }
    return this.showingTimes.length > 0 ? this.showingTimes[0] : null;
  }

  get movieTitle(): string {
    return this._movieData.title || this.currentMovie?.movieTitle || '';
  }

  get moviePoster(): string {
    return (
      this._movieData.poster ||
      this.currentMovie?.poster ||
      'assets/images/movie-placeholder.jpg'
    );
  }

  get movieDuration(): number {
    return this._movieData.duration || this.currentMovie?.runtimeMin || 0;
  }
  viewMovieDetail(movie: any): void {
    this.router.navigate(['/seat-selection'], {
      state: {
        movieData: {
          title: this.movieTitle,
          poster: this.moviePoster,
          duration: this.movieDuration,
        },
      },
    });
  }

  selectShowingTime(idOfShowingTime: string): void {
    const selectedShowing = this.showingTimes.find(
      (s) => s.id === idOfShowingTime
    );

    if (selectedShowing) {
      let currentMovieDetails: SummaryMovieDetails | null =
        this.bookingDataService.getCurrentMovieDetails();

      if (!currentMovieDetails) {
        currentMovieDetails = {
          movieId: selectedShowing.movieId,
          title: selectedShowing.movieTitle,
          runtime: this.formatRuntime(selectedShowing.runtimeMin),
          showtime: selectedShowing.dateTime,
          cinema: selectedShowing.cinemaName,
          cinemaId: selectedShowing.cinemaId,
          showtimeId: selectedShowing.id,
        };
      } else {
        currentMovieDetails.showtime = selectedShowing.dateTime;
        currentMovieDetails.cinema = selectedShowing.cinemaName;
        currentMovieDetails.showtimeId = selectedShowing.id;
        currentMovieDetails.cinemaId = selectedShowing.cinemaId;

        if (!currentMovieDetails.movieId) {
          currentMovieDetails.movieId = selectedShowing.movieId;
        }
        if (!currentMovieDetails.title) {
          currentMovieDetails.title = selectedShowing.movieTitle;
        }
        if (!currentMovieDetails.runtime) {
          currentMovieDetails.runtime = this.formatRuntime(
            selectedShowing.runtimeMin
          );
        }
      }

      this.bookingDataService.setSummaryMovieDetails(currentMovieDetails);
      console.log(
        'BuyTicketMovieComponent: Updated Movie Details in BookingDataService:',
        currentMovieDetails
      );

      this.router.navigate(['/seatSelection', idOfShowingTime]);
    } else {
      console.error('Selected showing time not found:', idOfShowingTime);
    }
  }
}
