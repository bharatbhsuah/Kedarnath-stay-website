import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { BookingService, Booking } from '../../core/services/booking.service';
import { PaymentService } from '../../core/services/payment.service';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-payment',
  template: `
    <section class="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10" *ngIf="booking">
      <h1 class="font-heading text-2xl sm:text-3xl text-dark mb-6">Payment</h1>
      <div class="card p-5 sm:p-6 space-y-4 text-sm">
        <div>
          <div class="font-semibold text-dark">Booking {{ booking.booking_ref }}</div>
          <div class="text-muted mt-1">
            {{ booking.check_in }} → {{ booking.check_out }} ·
            {{ booking.nights }} nights · {{ booking.guests }} guests
          </div>
        </div>
        <div class="border-t border-sand pt-4 space-y-2">
          <div class="flex justify-between">
            <span class="text-muted">Base amount</span>
            <span>{{ booking.base_amount | currencyInr }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted">Tax</span>
            <span>{{ booking.tax_amount | currencyInr }}</span>
          </div>
          <div class="flex justify-between font-semibold text-earth text-base pt-2">
            <span>Total payable</span>
            <span>{{ booking.total_amount | currencyInr }}</span>
          </div>
        </div>
        <div class="pt-2">
          <button class="btn-primary w-full" (click)="payNow()" [disabled]="loading">
            Pay Now
          </button>
          <div class="text-xs text-red-600 mt-2" *ngIf="error">{{ error }}</div>
        </div>
      </div>
    </section>
    <app-loading-spinner [show]="loading || !booking"></app-loading-spinner>
  `
})
export class PaymentComponent {
  bookingId!: number;
  booking: Booking | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private paymentService: PaymentService,
    private router: Router
  ) {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('bookingId');
      if (idParam) {
        this.bookingId = Number(idParam);
        this.loadBooking();
      }
    });
  }

  private loadBooking(): void {
    this.loading = true;
    this.bookingService.getBooking(this.bookingId).subscribe({
      next: (booking) => {
        this.booking = booking;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load booking details.';
      }
    });
  }

  async payNow(): Promise<void> {
    if (!this.booking) {
      return;
    }
    this.loading = true;
    this.error = '';
    try {
      await this.paymentService.loadRazorpayScript();
      this.paymentService.createOrder(this.bookingId).subscribe({
        next: (order) => {
          const options = {
            key: order.razorpayKeyId,
            amount: order.amount,
            currency: order.currency,
            name: 'Wilderness Stays',
            description: `Booking ${this.booking?.booking_ref}`,
            order_id: order.orderId,
            handler: (response: any) => {
              this.verifyPayment(order.orderId, response.razorpay_payment_id, response.razorpay_signature);
            },
            prefill: {},
            theme: {
              color: '#2d4a2d'
            }
          };
          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', () => {
            this.loading = false;
            this.error = 'Payment failed. Please try again.';
          });
          rzp.open();
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message || 'Unable to create payment order.';
        }
      });
    } catch (e) {
      this.loading = false;
      this.error = 'Unable to load payment gateway. Check your connection.';
    }
  }

  private verifyPayment(orderId: string, paymentId: string, signature: string): void {
    this.paymentService
      .verifyPayment({
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
        bookingId: this.bookingId
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/receipt', this.bookingId]);
        },
        error: () => {
          this.loading = false;
          this.error = 'Unable to verify payment. Please contact support.';
        }
      });
  }
}

