import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../../service/web-movie.service';
import { Movie } from '../../../models/web-movie.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingDataService } from '../../../service/booking-data.service';
import { SummaryMovieDetails } from '../../../models/SummaryMovieDetails.interface';
@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css'],
})
export class MovieComponent implements OnInit {
  movies: Movie[] = [];
  loading = false;
  error: string | null = null;
  cinemaId!: number;

  constructor(private movieService: MovieService, 
    private router: Router,
    private route: ActivatedRoute,
     private bookingDataService: BookingDataService
  ) {}

  ngOnInit(): void {
    this.loadMovies();
      this.cinemaId = +this.route.snapshot.paramMap.get('cinemaId')!;
  }

  loadMovies(): void {
    this.loading = true;
    this.error = null;

    this.movieService.getMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load movies';
        this.loading = false;
      },
    });
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
  viewMovieDetail(movie: Movie): void {
    const movieDetails: SummaryMovieDetails = {
      movieId: movie.id!.toString(), 
      title: movie.title,
      runtime: this.formatRuntime(movie.runtimeMin), 
      showtime: '',
      cinema: '',   
      showtimeId: '', 
      cinemaId: '',   
    };

   this.bookingDataService.setSummaryMovieDetails(movieDetails);
  
    this.router.navigate(['/buyTicketMovie', movie.id], {
      state: {
        movieData: {
          posterImage: movie.posterImage,
          title: movie.title,
          runtimeMin: movie.runtimeMin,
        },
      },
    });
  }

  
}
