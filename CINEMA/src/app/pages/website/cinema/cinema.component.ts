import { Component, OnInit } from '@angular/core';
import { CinemaService } from '../../../service/cinema.service';
import { Cinema } from '../../../models/cinema.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingDataService } from '../../../service/booking-data.service';
import { SummaryMovieDetails } from '../../../models/SummaryMovieDetails.interface';

@Component({
  selector: 'app-cinema',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cinema.component.html',
  styleUrl: './cinema.component.css',
})
export class CinemaComponent implements OnInit {
  cinemas: Cinema[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private cinemaService: CinemaService,
    private router: Router,
    private bookingDataService: BookingDataService
  ) {}

  ngOnInit(): void {
    this.loadCinemas();
  }

  loadCinemas(): void {
    this.loading = true;
    this.error = null;

    this.cinemaService.getAllCinemas().subscribe({
      next: (data) => {
        this.cinemas = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load cinemas';
        this.loading = false;
      },
    });
  }

  goToMovie(cinemaId: string | number): void {
   
    const selectedCinema = this.cinemas.find((c) => {
      const cIdStr = String(c.id);
      const searchIdStr = String(cinemaId);
      return cIdStr === searchIdStr;
    });


    if (selectedCinema) {
      sessionStorage.setItem('selectedCinemaName', selectedCinema.name);
      sessionStorage.setItem('selectedCinemaId', String(selectedCinema.id));
      
      this.bookingDataService.updateCinemaInfo(selectedCinema.name, String(selectedCinema.id));
            
      this.router.navigate(['/movies', String(selectedCinema.id)]);
    } else {
     
    }
  }
}