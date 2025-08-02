import { Component, OnDestroy, OnInit } from '@angular/core';
import { Seat } from '../../../models/Seat.interface';
import { SelectedSnackItem } from '../../../models/snack.interface';
import { combineLatest, Subscription } from 'rxjs';
import { BookingDataService } from '../../../service/booking-data.service';
import { PaymentService } from '../../../service/payment.service';
import { CreateBookingPayload } from '../../../models/CreateBookingPayload.interface';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SummaryMovieDetails } from '../../../models/SummaryMovieDetails.interface';

@Component({
  selector: 'app-booking-summary',
  imports: [CommonModule],
  templateUrl: './booking-summary.component.html',
  styleUrl: './booking-summary.component.css',
})
export class BookingSummaryComponent implements OnInit, OnDestroy {
  selectedSeats: Seat[] = [];
  selectedSnacksMap: Map<string, SelectedSnackItem> = new Map();

  movieDetails: SummaryMovieDetails | null = null;

  grandTotal: number = 0;

  bookingId: number | null = null;

  isProcessing: boolean = false;
  errorMessage: string | null = null;

  private subscriptions = new Subscription();

  private emergencyCinemaInfo: { name: string; id: string } | null = null;

  constructor(
    private bookingDataService: BookingDataService,
    private paymentService: PaymentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['cinemaId'] && params['cinemaName']) {
        this.emergencyCinemaInfo = {
          name: params['cinemaName'],
          id: params['cinemaId'],
        };
      }
    });

    this.subscriptions.add(
      combineLatest([
        this.bookingDataService.selectedSeats$,
        this.bookingDataService.selectedSnacksMap$,
        this.bookingDataService.movieDetails$,
      ]).subscribe(([seats, snacksMap, movieDetails]) => {
        this.selectedSeats = seats;
        this.selectedSnacksMap = snacksMap;
        this.movieDetails = movieDetails;

        if (movieDetails && (!movieDetails.cinema || !movieDetails.cinemaId)) {
          const storedCinemaName = sessionStorage.getItem('selectedCinemaName');
          const storedCinemaId = sessionStorage.getItem('selectedCinemaId');

          if (storedCinemaName && storedCinemaId) {
            this.bookingDataService.forceCinemaInfo(
              storedCinemaName,
              storedCinemaId
            );
          } else if (this.emergencyCinemaInfo) {
            this.bookingDataService.forceCinemaInfo(
              this.emergencyCinemaInfo.name,
              this.emergencyCinemaInfo.id
            );
          }
        }

        if (movieDetails) {
        } else {
        }

        this.calculateGrandTotal();
      })
    );

    this.subscriptions.add(
      this.bookingDataService.bookingId$.subscribe((id) => {
        this.bookingId = id;
      })
    );

    setTimeout(() => {
      if (
        this.movieDetails &&
        (!this.movieDetails.cinema || !this.movieDetails.cinemaId)
      ) {
        const storedCinemaName = sessionStorage.getItem('selectedCinemaName');
        const storedCinemaId = sessionStorage.getItem('selectedCinemaId');

        if (storedCinemaName && storedCinemaId) {
          this.movieDetails.cinema = storedCinemaName;
          this.movieDetails.cinemaId = storedCinemaId;
        }
      }
    }, 500);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getSeatPrice(seatTypeName: string): number {
    const prices: { [key: string]: number } = {
      standard: 50000,
      premium: 65000,
      vip: 75000,
      couple: 100000,
      wheelchair: 50000,
    };
    const aliasMap: { [key: string]: string } = {
      'love seat': 'couple',
      couple: 'couple',
      'vip recliner': 'vip',
      vip: 'vip',
      standard: 'standard',
      premium: 'premium',
      wheelchair: 'wheelchair',
    };
    const normalized = seatTypeName.trim().toLowerCase();
    const mappedType = aliasMap[normalized];
    if (!mappedType) {
      console.warn('Unknown seat type:', seatTypeName);
    }

    return prices[mappedType] || 0;
  }

  calculateGrandTotal(): void {
    let seatsTotal = this.selectedSeats.reduce(
      (sum, seat) => sum + this.getSeatPrice(seat.seatTypeName),
      0
    );
    let snacksTotal = 0;

    console.log(
      'calculateGrandTotal - selectedSnacksMap size:',
      this.selectedSnacksMap.size
    );
    console.log(
      'calculateGrandTotal - selectedSnacksMap entries:',
      Array.from(this.selectedSnacksMap.entries())
    );

    this.selectedSnacksMap.forEach((item) => {
      console.log('calculateGrandTotal - processing snack:', item);
      snacksTotal += item.snack.price * item.quantity;
    });

    this.grandTotal = seatsTotal + snacksTotal;
    console.log(
      'calculateGrandTotal - seatsTotal:',
      seatsTotal,
      'snacksTotal:',
      snacksTotal,
      'grandTotal:',
      this.grandTotal
    );
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  private validateBookingData(): boolean {
    console.log('=== BOOKING VALIDATION START ===');
    console.log('Selected seats:', this.selectedSeats);
    console.log(
      'Selected snacks:',
      Array.from(this.selectedSnacksMap.entries())
    );
    console.log('Movie details:', this.movieDetails);

    // Check if seats are selected
    if (!this.selectedSeats || this.selectedSeats.length === 0) {
      console.error('❌ No seats selected');
      this.errorMessage = 'Vui lòng chọn ít nhất một ghế.';
      return false;
    }

    // Check if all seats have required properties
    for (const seat of this.selectedSeats) {
      if (!seat.seatId || seat.seatId === null || seat.seatId === undefined) {
        console.error('❌ Seat missing seatId:', seat);
        this.errorMessage = 'Ghế thiếu thông tin ID. Vui lòng chọn lại ghế.';
        return false;
      }

      if (!seat.seatTypeName || seat.seatTypeName.trim() === '') {
        console.error('❌ Seat missing seatTypeName:', seat);
        this.errorMessage =
          'Ghế thiếu thông tin loại ghế. Vui lòng chọn lại ghế.';
        return false;
      }
    }

    // Check movie details
    if (!this.movieDetails) {
      console.error('❌ No movie details');
      this.errorMessage = 'Thiếu thông tin phim. Vui lòng thử lại từ đầu.';
      return false;
    }

    const requiredFields = ['movieId', 'showtimeId', 'cinemaId'];
    for (const field of requiredFields) {
      if (
        !this.movieDetails[field as keyof SummaryMovieDetails] ||
        this.movieDetails[field as keyof SummaryMovieDetails] === ''
      ) {
        console.error(
          `❌ Missing ${field}:`,
          this.movieDetails[field as keyof SummaryMovieDetails]
        );
        this.errorMessage = `Thiếu thông tin ${field}. Vui lòng thử lại từ đầu.`;
        return false;
      }
    }

    return true;
  }

  handlePaymentButtonClick(): void {
    console.log('BookingSummaryComponent: Payment button clicked');
    this.errorMessage = null;
    this.isProcessing = true;

    this.calculateGrandTotal();
    console.log(
      'BookingSummaryComponent: Calculated grand total:',
      this.grandTotal
    );

    if (!this.validateBookingData()) {
      this.isProcessing = false;
      return;
    }

    if (
      this.movieDetails &&
      (!this.movieDetails.cinemaId || this.movieDetails.cinemaId === '')
    ) {
      const storedCinemaId = sessionStorage.getItem('selectedCinemaId');
      const storedCinemaName = sessionStorage.getItem('selectedCinemaName');

      if (storedCinemaId && storedCinemaName) {
        this.movieDetails.cinemaId = storedCinemaId;
        this.movieDetails.cinema = storedCinemaName;
        console.log('📍 Updated cinema info from sessionStorage:', {
          cinemaId: storedCinemaId,
          cinemaName: storedCinemaName,
        });
      } else if (this.emergencyCinemaInfo) {
        this.movieDetails.cinemaId = this.emergencyCinemaInfo.id;
        this.movieDetails.cinema = this.emergencyCinemaInfo.name;
      }
    }

    const showingTimeId = parseInt(this.movieDetails!.showtimeId, 10);

    if (isNaN(showingTimeId)) {
      console.error('❌ Invalid showtimeId:', this.movieDetails!.showtimeId);
      this.errorMessage = 'ID suất chiếu không hợp lệ. Vui lòng thử lại.';
      this.isProcessing = false;
      return;
    }

    if (this.bookingId === null) {
      this.createBookingAndThenPay(showingTimeId);
    } else {
      this.initiateVNPayPayment();
    }
  }

  private getTicketTypeId(seatTypeName: string): number {
    const ticketTypeMap: { [key: string]: number } = {
      standard: 1,
      premium: 2,
      vip: 3,
      couple: 4,
      'love seat': 4,
      'vip recliner': 3,
      wheelchair: 1,
    };

    const normalized = seatTypeName.trim().toLowerCase();
    const ticketTypeId = ticketTypeMap[normalized];

    if (!ticketTypeId) {
      console.warn('Unknown seat type for ticket mapping:', seatTypeName);
      return 1; // default to standard ticket type
    }

    return ticketTypeId;
  }

  private createBookingAndThenPay(showingTimeId: number): void {
    console.log('BookingSummaryComponent: Preparing booking payload...');

    const seatsWithTicketTypeId = this.selectedSeats.map((seat) => {
      if (seat.ticketTypeId === undefined || seat.ticketTypeId === null) {
        seat.ticketTypeId = this.getTicketTypeId(seat.seatTypeName);
        console.log(
          `Assigned ticketTypeId ${seat.ticketTypeId} to seat ${seat.seatLocation}`
        );
      }
      return seat;
    });

    const ticketTypeQuantities: { [key: number]: number } = {};
    seatsWithTicketTypeId.forEach((seat) => {
      if (seat.ticketTypeId !== undefined && seat.ticketTypeId !== null) {
        const typeId = seat.ticketTypeId as number;
        ticketTypeQuantities[typeId] = (ticketTypeQuantities[typeId] || 0) + 1;
      } else {
        console.error(
          `Seat ${seat.seatLocation} still missing ticketTypeId after assignment.`
        );
        this.errorMessage =
          'Thiếu thông tin loại vé cho một ghế đã chọn. Vui lòng thử lại.';
        this.isProcessing = false;
        return;
      }
    });

    console.log('Prepared ticketTypeQuantities:', ticketTypeQuantities);

    const snackQuantities: { [key: number]: number } = {};
    const snackDetails: Array<{
      id: number;
      quantity: number;
      price: number;
      name: string;
    }> = [];
    let calculatedSnacksTotal = 0;

    this.selectedSnacksMap.forEach((item) => {
      if (
        item.snack.id !== undefined &&
        item.snack.id !== null &&
        item.quantity > 0
      ) {
        const snackId = item.snack.id as number;
        snackQuantities[snackId] = item.quantity;

        snackDetails.push({
          id: snackId,
          quantity: item.quantity,
          price: item.snack.price,
          name: item.snack.name || 'Unknown',
        });

        calculatedSnacksTotal += item.snack.price * item.quantity;
      }
    });
  
    const verifiedGrandTotal = this.grandTotal;

    const seatIdsForBackend: number[] = seatsWithTicketTypeId.map((seat) => {
      if (seat.seatId !== undefined && seat.seatId !== null) {
        return seat.seatId;
      } else {
        console.error('Seat missing ID:', seat);
        throw new Error('Missing seatId for a selected seat.');
      }
    });

    const bookingPayload: CreateBookingPayload = {
      ticketTypeQuantities: ticketTypeQuantities,
      seatIds: seatIdsForBackend,
      snackQuantities: snackQuantities,
      movieDetails: {
        movieId: this.movieDetails!.movieId,
        showtimeId: this.movieDetails!.showtimeId,
        cinemaId: this.movieDetails!.cinemaId,
      },
      totalAmount: verifiedGrandTotal,
    };

    console.log(
      'BookingSummaryComponent: Final booking payload:',
      bookingPayload
    );

    // Continue with the API call...
    this.paymentService.createBooking(showingTimeId, bookingPayload).subscribe({
      next: (response) => {
        console.log(
          '✅ BookingSummaryComponent: Booking created successfully:',
          response
        );
        if (response && response.bookingId) {
          this.bookingDataService.setBookingId(response.bookingId);
          this.bookingId = response.bookingId;
          this.initiateVNPayPayment();
        } else {
          this.errorMessage =
            'Không nhận được ID đặt vé từ máy chủ. Vui lòng thử lại.';
          this.isProcessing = false;
        }
      },
      error: (err) => {
        console.error(
          '❌ BookingSummaryComponent: Error creating booking:',
          err
        );
        this.errorMessage =
          'Lỗi khi tạo đơn đặt vé: ' +
          (err.error?.message || 'Không xác định.');
        this.isProcessing = false;
      },
    });
  }
  private initiateVNPayPayment(): void {
    if (this.bookingId === null) {
      this.errorMessage = 'Booking ID không tồn tại. Không thể thanh toán.';
      this.isProcessing = false;
      return;
    }

    const paymentData = {
      amount: this.grandTotal,
      orderInfo: `Thanh toán vé xem phim: ${
        this.movieDetails?.title || 'Movie Ticket'
      } cho Booking ID: ${this.bookingId}`,
      returnUrl: `${window.location.origin}/payment-result`,
      language: 'vn',
    };
    this.paymentService
      .createVNPayPayment(this.bookingId, paymentData)
      .subscribe({
        next: (response: any) => {
          this.isProcessing = false;

          if (response && response.paymentUrl) {
            console.log('🔗 Redirecting to payment URL:', response.paymentUrl);
            window.location.href = response.paymentUrl;
          } else if (response && response.vnpUrl) {
            console.log('🔗 Redirecting to VNP URL:', response.vnpUrl);
            window.location.href = response.vnpUrl;
          } else {
            this.errorMessage =
              'Không nhận được URL thanh toán từ máy chủ. Vui lòng thử lại.';
            console.error(
              'Did not receive payment URL from backend:',
              response
            );
          }
        },
        error: (err) => {
          console.error('❌ BookingSummaryComponent: VNPay error:', err);
          this.errorMessage =
            'Lỗi khi khởi tạo thanh toán: ' +
            (err.error?.message || 'Không xác định.');
          this.isProcessing = false;
        },
      });
  }
}
