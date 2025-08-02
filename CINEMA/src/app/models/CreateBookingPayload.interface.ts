export interface CreateBookingPayload {
  // selectedSeats: { seatLocation: string; seatTypeName: string }[];
  // selectedSnacks: { snackId: string; quantity: number }[];
   movieDetails: {
    movieId: string;
    showtimeId: string;
    cinemaId: string;
  };
  totalAmount: number;
  seatIds: number[];
  snackQuantities: { [key: number]: number };

  ticketTypeQuantities: { [key: number]: number };
}
