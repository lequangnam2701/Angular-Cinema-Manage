import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../service/payment.service';
import { BookingDataService } from '../../../service/booking-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-result',
  imports: [CommonModule],
  templateUrl: './payment-result.component.html',
  styleUrl: './payment-result.component.css',
})
export class PaymentResultComponent {
  paymentStatus: 'success' | 'failed' | 'processing' = 'processing';
  bookingId: string | null = null;
  transactionId: string | null = null;
  amount: number = 0;
  orderInfo: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private bookingDataService: BookingDataService
  ) {}

  ngOnInit(): void {
    // Lấy query parameters từ VNPay callback
    this.route.queryParams.subscribe((params) => {
      console.log('Payment callback params:', params);

      // Lấy thông tin từ VNPay response
      const vnpResponseCode = params['vnp_ResponseCode'];
      const vnpTransactionNo = params['vnp_TransactionNo'];
      const vnpAmount = params['vnp_Amount'];
      const vnpOrderInfo = params['vnp_OrderInfo'];
      const vnpTxnRef = params['vnp_TxnRef']; 

      this.bookingId = params['bookingId'] || vnpTxnRef;
      this.transactionId = vnpTransactionNo;
      this.amount = vnpAmount ? parseInt(vnpAmount) / 100 : 0; 
      this.orderInfo = vnpOrderInfo || '';

      // Kiểm tra trạng thái thanh toán
      if (vnpResponseCode === '00') {
        this.paymentStatus = 'success';
        this.handleSuccessfulPayment();
      } else {
        this.paymentStatus = 'failed';
        this.handleFailedPayment(vnpResponseCode);
      }
    });
  }

  private handleSuccessfulPayment(): void {
    console.log('Payment successful, updating booking status...');

    // Có thể gọi API để cập nhật trạng thái booking
    if (this.bookingId) {
      this.paymentService
        .confirmPayment(this.bookingId, {
          transactionId: this.transactionId,
          amount: this.amount,
          status: 'success',
        })
        .subscribe({
          next: (response) => {
            console.log('Booking status updated successfully:', response);
          },
          error: (err) => {
            console.error('Error updating booking status:', err);
            // Vẫn hiển thị thành công vì thanh toán đã thành công
          },
        });
    }

    // Clear booking data sau khi thanh toán thành công
    this.bookingDataService.clearAllData();
  }

  private handleFailedPayment(responseCode: string): void {
    console.log('Payment failed with code:', responseCode);

    // Map response code to error message
    const errorMessages: { [key: string]: string } = {
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
      '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.',
      '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)',
    };

    this.errorMessage =
      errorMessages[responseCode] ||
      'Giao dịch không thành công. Vui lòng thử lại.';
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToBookings(): void {
    this.router.navigate(['/my-bookings']);
  }

  tryAgain(): void {
    // Quay lại trang booking summary để thử thanh toán lại
    this.router.navigate(['/booking-summary']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }
}
