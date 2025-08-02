import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateBookingPayload } from '../models/CreateBookingPayload.interface';
import { Observable } from 'rxjs';
import { CreateBookingResponse } from '../models/CreateBookingResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = 'http://localhost:8001/api';

  constructor(private http: HttpClient) {}

  createBooking(
    showingTimeId: number,
    payload: CreateBookingPayload
  ): Observable<CreateBookingResponse> {
    const url = `${this.baseUrl}/bookings/user`;
    const params = new HttpParams().set(
      'showingTimeId',
      showingTimeId.toString()
    );
    console.log('Backend request to create booking:', url, payload);
    return this.http.post<CreateBookingResponse>(url, payload, {
      params: params,
    });
  }

  createVNPayPayment(bookingId: number, paymentData: any): Observable<any> {
    const url = `${this.baseUrl}/bookings/${bookingId}/vnpay`;
    console.log(
      `Backend request to initiate VNPay for booking ${bookingId}:`,
      url,
      paymentData
    );
    return this.http.post(url, paymentData);
  }

  verifyVNPayReturn(queryParams: any): Observable<any> {
    const url = `${this.baseUrl}/vnpay/vnpay_return`;
    console.log('Backend request to verify VNPay return:', url, queryParams);
    return this.http.get(url, { params: queryParams });
  }

  confirmPayment(bookingId: string, paymentData: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/bookings/${bookingId}/confirm-payment`,
      paymentData
    );
  }
}
