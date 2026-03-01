import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { BookingService, Booking } from '../../core/services/booking.service';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-receipt',
  template: `
    <section class="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10" *ngIf="booking">
      <div class="card p-6 sm:p-8">
        <h1 class="font-heading text-2xl sm:text-3xl text-dark mb-6">Booking Receipt</h1>
        <div class="text-sm text-muted space-y-1 mb-6">
          <div class="font-semibold text-dark">Booking {{ booking.booking_ref }}</div>
          <div>Dates: {{ booking.check_in }} → {{ booking.check_out }} ({{ booking.nights }} nights)</div>
          <div>Guests: {{ booking.guests }}</div>
          <div>Status: {{ booking.status }} · Payment: {{ booking.payment_status }}</div>
        </div>
        <div class="border-t border-sand pt-4 mb-6 text-sm space-y-2">
          <div class="flex justify-between">
            <span class="text-muted">Base amount</span>
            <span>{{ booking.base_amount | currencyInr }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted">Tax</span>
            <span>{{ booking.tax_amount | currencyInr }}</span>
          </div>
          <div class="flex justify-between font-semibold text-earth text-base pt-2">
            <span>Total</span>
            <span>{{ booking.total_amount | currencyInr }}</span>
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <button class="btn-primary" (click)="downloadPdf()">Download PDF</button>
          <button class="btn-gold" (click)="printPage()">Print</button>
          <button class="btn-primary" routerLink="/my-bookings">My Bookings</button>
        </div>
      </div>
    </section>
    <app-loading-spinner [show]="loading || !booking"></app-loading-spinner>
  `
})
export class ReceiptComponent {
  bookingId!: number;
  booking: Booking | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
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
        this.router.navigate(['/my-bookings']);
      }
    });
  }

  downloadPdf(): void {
    const link = document.createElement('a');
    link.href = `http://localhost:3000/api/receipts/${this.bookingId}`;
    link.download = `receipt-${this.bookingId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  printPage(): void {
    window.print();
  }
}

