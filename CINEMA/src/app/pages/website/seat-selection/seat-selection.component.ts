import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../service/booking.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faChair } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { Seat } from '../../../models/Seat.interface';
import { BookingDataService } from '../../../service/booking-data.service';
library.add(faChair);

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './seat-selection.component.html',
  styleUrl: './seat-selection.component.css',
})
export class SeatSelectionComponent implements OnInit {
  showingTimeId: string = '';
  seats: Seat[] = [];
  selectedSeats: Seat[] = [];
  faChair = faChair;

  seatsByRow: Map<string, Seat[]> = new Map();
  sortedRowKeys: string[] = [];

  seatPrices = {
    standard: 50000,
    premium: 65000,
    vip: 75000,
    couple: 100000,
    wheelchair: 50000,
  };

  constructor(
    private library: FaIconLibrary,
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private router: Router,
    private bookingDataService: BookingDataService
  ) {
    this.library.addIcons(this.faChair);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.showingTimeId = params.get('showingTimeId') || '';
      if (this.showingTimeId) {
        this.fetchSeats();
      } else {
        console.warn('showingTimeId is empty or null');
      }
    });
    this.bookingDataService.selectedSeats$.subscribe((seats) => {
      if (seats && seats.length > 0 && this.selectedSeats.length === 0) {
        this.selectedSeats = [...seats];
        ``;
      }
    });
  }

  fetchSeats(): void {
    if (!this.showingTimeId) {
      return;
    }

    this.bookingService.getAllSeatsWithStatus(this.showingTimeId).subscribe({
      next: (data) => {
        this.seats = data;
        this.groupSeatsByRow();
      },
    });
  }

  private groupSeatsByRow(): void {
    this.seatsByRow = new Map();
    const rowSet = new Set<string>();

    this.seats.forEach((seat) => {
      const rowName = seat.seatLocation.charAt(0);
      if (!this.seatsByRow.has(rowName)) {
        this.seatsByRow.set(rowName, []);
        rowSet.add(rowName);
      }
      this.seatsByRow.get(rowName)?.push(seat);
    });

    this.seatsByRow.forEach((rowSeats) => {
      rowSeats.sort((a, b) => {
        const numberA = parseInt(a.seatLocation.substring(1), 10);
        const numberB = parseInt(b.seatLocation.substring(1), 10);
        return numberA - numberB;
      });
    });

    this.sortedRowKeys = Array.from(rowSet).sort();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }

  getSeatClass(seat: Seat): string {
    if (!seat.available) {
      return 'text-gray-400 cursor-not-allowed';
    }
    if (this.selectedSeats.some((s) => s.seatId === seat.seatId)) {
      return 'text-blue-400 border-blue-400';
    }
    const seatType = seat.seatTypeName.toLowerCase();

    if (seatType.includes('standard') || seatType.includes('thường')) {
      return 'text-green-500 border-green-500';
    }
    if (seatType.includes('premium')) {
      return 'text-orange-500 border-orange-500';
    }
    if (seatType.includes('vip')) {
      return 'text-red-500 border-red-500';
    }
    if (
      seatType.includes('couple') ||
      seatType.includes('đôi') ||
      seatType.includes('love seat')
    ) {
      return 'text-purple-500 border-purple-500';
    }
    if (seatType.includes('wheelchair') || seatType.includes('khuyết tật')) {
      return 'text-cyan-500 border-cyan-500';
    }

    return 'text-gray-500 border-gray-500';
  }

  toggleSeatSelection(seat: Seat): void {
    if (seat.available) {
      const index = this.selectedSeats.findIndex(
        (s) => s.seatId === seat.seatId
      );
      if (index > -1) {
        this.selectedSeats.splice(index, 1);
      } else {
        this.selectedSeats.push(seat);
      }
    }
  }

  getRow(seat: Seat): string {
    return seat.seatLocation.charAt(0);
  }
  getNumber(seat: Seat): string {
    return seat.seatLocation.substring(1);
  }

  get maxColumnCount(): number {
    if (!this.seats || this.seats.length === 0) {
      return 8;
    }

    try {
      const validColumns = this.seats
        .filter(
          (seat) =>
            seat &&
            seat.seatLocation !== undefined &&
            seat.seatLocation !== null
        )
        .map((seat) => {
          const columnValue =
            typeof seat.seatLocation === 'string'
              ? parseInt(seat.seatLocation.substring(1), 10)
              : seat.seatLocation;
          return columnValue;
        })
        .filter(
          (column) => typeof column === 'number' && !isNaN(column) && column > 0
        );

      if (validColumns.length === 0) {
        return 8;
      }
      const maxColumn = Math.max(...validColumns);
      return maxColumn;
    } catch (error) {
      return 8;
    }
  }

  get totalSelectedPrice(): number {
    return this.selectedSeats.reduce((sum, seat) => {
      const price = this.getSeatPrice(seat.seatTypeName);
      return sum + price;
    }, 0);
  }
  getSeatPrice(seatTypeName: string): number {
    if (!seatTypeName) return 0;
    const normalizedTypeName = seatTypeName.toLowerCase();
    if (this.seatPrices[normalizedTypeName as keyof typeof this.seatPrices]) {
      return this.seatPrices[
        normalizedTypeName as keyof typeof this.seatPrices
      ];
    }
    if (normalizedTypeName.includes('vip')) {
      return this.seatPrices.vip;
    }
    if (normalizedTypeName.includes('premium')) {
      return this.seatPrices.premium;
    }
    if (
      normalizedTypeName.includes('standard') ||
      normalizedTypeName.includes('thường')
    ) {
      return this.seatPrices.standard;
    }
    if (
      normalizedTypeName.includes('couple') ||
      normalizedTypeName.includes('đôi') ||
      normalizedTypeName.includes('love seat')
    ) {
      return this.seatPrices.couple;
    }
    if (
      normalizedTypeName.includes('wheelchair') ||
      normalizedTypeName.includes('khuyết tật')
    ) {
      return this.seatPrices.wheelchair;
    }
    return 0;
  }
  goToSnackSelection(): void {
    if (this.selectedSeats.length === 0) {
      alert('Vui lòng chọn ít nhất một ghế!');
      return;
    }
    this.bookingDataService.setSelectedSeats(this.selectedSeats);
    this.router.navigate(['/snack']);
  }
}
