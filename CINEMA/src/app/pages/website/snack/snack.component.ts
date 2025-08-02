import { Component } from '@angular/core';
import { SelectedSnackItem, Snack } from '../../../models/snack.interface';
import { SnacksService } from '../../../service/snack.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieDetails } from '../../../models/MovieDetail.interface';
import { BookingDataService } from '../../../service/booking-data.service';
import { SummaryMovieDetails } from '../../../models/SummaryMovieDetails.interface';

@Component({
  selector: 'app-snack',
  imports: [CommonModule],
  templateUrl: './snack.component.html',
  styleUrl: './snack.component.css',
})
export class SnacksComponent {
  snacks: Snack[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private BookingDataService: BookingDataService,
    private snacksService: SnacksService,
    private router: Router
  ) {}
  movieDetails: SummaryMovieDetails | null = null;

  ngOnInit(): void {
    this.loadSnacks();
    this.BookingDataService.movieDetails$.subscribe((details) => {
      this.movieDetails = details;
    });
  }

  loadSnacks(): void {
    this.snacksService.getSnacks().subscribe({
      next: (data) => {
        this.snacks = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load snacks';
        this.loading = false;
        console.error('Error fetching snacks:', err);
      },
    });
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/placeholder-snack.jpg';
  }
  selectedSnacksMap: Map<string, SelectedSnackItem> = new Map();
  totalSnackPrice: number = 0;
  totalItems: number = 0;

  calculateTotals(): void {
    this.totalSnackPrice = 0;
    this.totalItems = 0;
    this.selectedSnacksMap.forEach((item) => {
      this.totalSnackPrice += item.snack.price * item.quantity;
      this.totalItems += item.quantity;
    });
  }
  getSnackQuantity(snack: Snack): number {
    if (!snack.snackId) {
      return 0;
    }

    return this.selectedSnacksMap.has(snack.snackId)
      ? this.selectedSnacksMap.get(snack.snackId)!.quantity
      : 0;
  }
  decreaseQuantity(snack: Snack): void {
    const snackId = snack.snackId;
    if (!snackId) return;
    let currentItem = this.selectedSnacksMap.get(snackId);
    if (currentItem && currentItem.quantity > 0) {
      currentItem.quantity--;
      if (currentItem.quantity === 0) {
        this.selectedSnacksMap.delete(snackId);
      }
    }
    this.calculateTotals();
  }
  increaseQuantity(snack: Snack): void {
    const snackId = snack.snackId;
    if (!snackId) return;

    let currentItem = this.selectedSnacksMap.get(snackId);
    if (currentItem) {
      currentItem.quantity++;
    } else {
      this.selectedSnacksMap.set(snackId, { snack: snack, quantity: 1 });
    }
    this.calculateTotals();
  }
  toggleSnackSelection(snack: Snack): void {
    const snackId = snack.snackId;
    if (!snackId) return;

    if (!this.selectedSnacksMap.has(snackId)) {
      this.selectedSnacksMap.set(snackId, { snack: snack, quantity: 1 });
    } else {
      const currentItem = this.selectedSnacksMap.get(snackId)!;
      if (currentItem.quantity === 0) {
        this.increaseQuantity(snack);
      } else {
      }
    }

    this.calculateTotals();
  }
  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }
  goToSummary(): void {
    this.BookingDataService.setSelectedSnacksMap(this.selectedSnacksMap);
    if (!this.movieDetails) {
      console.warn(
        'Movie details not set before navigating to summary. Ensure movie details are set in a prior step.'
      );
    }
    this.router.navigate(['/summary']);
  }
}
