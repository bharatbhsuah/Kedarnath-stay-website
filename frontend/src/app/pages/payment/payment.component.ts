import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService, Booking } from '../../core/services/booking.service';
import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-payment',
  template: `
    <section class="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10" *ngIf="booking">
      <h1 class="font-heading text-2xl sm:text-3xl text-dark mb-6">Payment</h1>
      <div class="card p-5 sm:p-6 space-y-4 text-sm">
        <div>
          <div class="font-semibold text-dark">Booking {{ booking.booking_ref }}</div>
          <div class="text-muted mt-1">
            {{ booking.check_in }} to {{ booking.check_out }} |
            {{ booking.nights }} nights | {{ booking.guests }} guests
          </div>
        </div>
        <div class="border-t border-sand pt-4 space-y-2">
          <div class="flex justify-between">
            <span class="text-muted">Registration Fee (Pay Now)</span>
            <span>{{ booking.registration_amount | currencyInr }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted">Balance Due on Arrival</span>
            <span>{{ booking.arrival_amount | currencyInr }} (Pay in cash at hotel check-in)</span>
          </div>
          <div class="text-xs text-muted">
            Registration fee is non-refundable.
          </div>
          <div class="flex justify-between font-semibold text-earth text-base pt-2">
            <span>Total Booking Amount</span>
            <span>{{ booking.total_amount | currencyInr }}</span>
          </div>
        </div>
        <div class="pt-2">
          <div *ngIf="verificationPending" class="rounded-md border border-amber-300 bg-amber-50 text-amber-900 px-3 py-2 text-sm">
            {{ successMessage || 'Payment submitted. Verification is pending with admin.' }}
          </div>

          <div *ngIf="!verificationPending && isDesktop; else mobilePayment" class="space-y-4">
            <div class="text-sm text-muted">
              Scan QR from your phone UPI app and complete payment for
              <span class="font-semibold text-dark">{{ booking.registration_amount | currencyInr }}</span>.
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="border border-sand rounded-lg p-3">
                <div class="font-semibold text-dark mb-2">Paytm</div>
                <img
                  [src]="paytmQrPath"
                  alt="Paytm QR Code"
                  class="w-full max-w-[220px] mx-auto rounded-md border border-sand"
                />
                <div class="mt-2 text-xs text-muted break-all">UPI ID: {{ upiIds.paytm || '-' }}</div>
              </div>
              <div class="border border-sand rounded-lg p-3">
                <div class="font-semibold text-dark mb-2">PhonePe</div>
                <img
                  [src]="phonepeQrPath"
                  alt="PhonePe QR Code"
                  class="w-full max-w-[220px] mx-auto rounded-md border border-sand"
                />
                <div class="mt-2 text-xs text-muted break-all">UPI ID: {{ upiIds.phonepe || '-' }}</div>
              </div>
            </div>
          </div>
          <ng-template #mobilePayment>
            <div class="space-y-4" *ngIf="!verificationPending">
              <div class="text-sm text-muted">
                Scan QR from another device, or use app buttons below to complete payment for
                <span class="font-semibold text-dark">{{ booking.registration_amount | currencyInr }}</span>.
              </div>
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="border border-sand rounded-lg p-3">
                  <div class="font-semibold text-dark mb-2">Paytm</div>
                  <img
                    [src]="paytmQrPath"
                    alt="Paytm QR Code"
                    class="w-full max-w-[220px] mx-auto rounded-md border border-sand"
                  />
                  <div class="mt-2 text-xs text-muted break-all">UPI ID: {{ upiIds.paytm || '-' }}</div>
                </div>
                <div class="border border-sand rounded-lg p-3">
                  <div class="font-semibold text-dark mb-2">PhonePe</div>
                  <img
                    [src]="phonepeQrPath"
                    alt="PhonePe QR Code"
                    class="w-full max-w-[220px] mx-auto rounded-md border border-sand"
                  />
                  <div class="mt-2 text-xs text-muted break-all">UPI ID: {{ upiIds.phonepe || '-' }}</div>
                </div>
              </div>
            </div>
            <div class="grid gap-3 sm:grid-cols-2 mt-3" *ngIf="!verificationPending">
              <button
                type="button"
                class="btn-primary text-center"
                (click)="openPaymentApp('paytm')"
                [disabled]="!deepLinks.paytm || loading"
              >
                Pay with Paytm ({{ booking.registration_amount | currencyInr }})
              </button>
              <button
                type="button"
                class="btn-secondary text-center"
                (click)="openPaymentApp('phonepe')"
                [disabled]="!deepLinks.phonepe || loading"
              >
                Pay with PhonePe ({{ booking.registration_amount | currencyInr }})
              </button>
            </div>
          </ng-template>

          <div class="mt-3" *ngIf="!verificationPending">
            <button class="btn-primary w-full" (click)="confirmPayment()" [disabled]="loading">
              I Have Completed Payment
            </button>
          </div>
          <div class="text-xs text-muted mt-2">
            If app link does not open, copy UPI ID and pay manually:
            {{ upiIds.paytm }} / {{ upiIds.phonepe }}
          </div>
          <div class="mt-2 space-y-2">
            <input
              type="text"
              class="w-full border border-sand rounded-md px-3 py-2"
              placeholder="Transaction ID (optional)"
              [(ngModel)]="transactionId"
            />
          </div>
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
  guestPhone = '';
  transactionId = '';
  successMessage = '';
  deepLinks: { paytm: string; phonepe: string } = { paytm: '', phonepe: '' };
  upiLinks: { paytm: string; phonepe: string } = { paytm: '', phonepe: '' };
  upiIds: { paytm: string; phonepe: string } = { paytm: '', phonepe: '' };
  verificationPending = false;
  isDesktop = true;
  paytmQrPath = 'assets/payments/paytm-qr.png';
  phonepeQrPath = 'assets/payments/phonepe-qr.png';
  selectedMethod: 'paytm' | 'phonepe' | 'upi' = 'upi';
  private routeParamsReady = false;
  private queryParamsReady = false;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private paymentService: PaymentService
  ) {
    this.isDesktop = this.detectDesktop();
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('bookingId');
      if (idParam) {
        this.bookingId = Number(idParam);
      }
      this.routeParamsReady = true;
      this.tryLoadBooking();
    });
    this.route.queryParamMap.subscribe((params) => {
      this.guestPhone = (params.get('phone') || '').trim();
      this.queryParamsReady = true;
      this.tryLoadBooking();
    });
  }

  private tryLoadBooking(): void {
    if (!this.routeParamsReady || !this.queryParamsReady || !this.bookingId) {
      return;
    }
    this.loadBooking();
  }

  private loadBooking(): void {
    this.loading = true;
    const request = this.guestPhone
      ? this.bookingService.getGuestBooking(this.bookingId, this.guestPhone)
      : this.bookingService.getBooking(this.bookingId);

    request.subscribe({
      next: (booking) => {
        this.booking = booking;
        this.preparePaymentLinks();
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load booking details.';
      }
    });
  }

  private preparePaymentLinks(): void {
    if (!this.booking) {
      this.loading = false;
      return;
    }

    this.error = '';
    this.successMessage = '';

    if (this.booking.payment_status === 'pending_verification') {
      this.verificationPending = true;
      this.loading = false;
      this.successMessage = 'Payment already submitted. Admin verification is pending.';
      return;
    }
    this.verificationPending = false;

    this.paymentService.createOrder(this.bookingId, this.guestPhone || undefined).subscribe({
      next: (order) => {
        this.deepLinks = order.deepLinks;
        this.upiLinks = order.upiLinks || { paytm: '', phonepe: '' };
        this.upiIds = {
          paytm:
            (order.upiIds?.paytm || '').trim() ||
            this.extractUpiId(order.deepLinks.paytm) ||
            this.extractUpiId(order.upiLinks?.paytm),
          phonepe:
            (order.upiIds?.phonepe || '').trim() ||
            this.extractUpiId(order.deepLinks.phonepe) ||
            this.extractUpiId(order.upiLinks?.phonepe)
        };
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Unable to generate payment links.';
      }
    });
  }

  setSelectedMethod(method: 'paytm' | 'phonepe'): void {
    this.selectedMethod = method;
  }

  openPaymentApp(method: 'paytm' | 'phonepe'): void {
    this.setSelectedMethod(method);
    const deepLink = this.deepLinks[method];
    const upiLink = method === 'paytm' ? '' : this.upiLinks.phonepe;
    if (!deepLink) {
      return;
    }

    if (method === 'phonepe') {
      window.location.href = deepLink;
      setTimeout(() => {
        if (upiLink) {
          window.location.href = upiLink;
        }
      }, 900);
      return;
    }

    window.location.href = deepLink;
  }

  confirmPayment(): void {
    this.loading = true;
    this.error = '';
    this.successMessage = '';
    this.paymentService
      .verifyPayment({
        bookingId: this.bookingId,
        method: this.selectedMethod,
        transactionId: this.transactionId.trim() || undefined,
        phone: this.guestPhone || undefined
      })
      .subscribe({
        next: (resp) => {
          this.loading = false;
          if (resp?.booking) {
            this.booking = resp.booking;
          }
          this.verificationPending = true;
          this.successMessage =
            resp?.message || 'Payment submitted. Verification is pending with admin.';
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message || 'Unable to submit payment for verification.';
        }
      });
  }

  private extractUpiId(link?: string): string {
    if (!link) {
      return '';
    }
    const match = link.match(/[?&]pa=([^&]+)/i);
    return match ? decodeURIComponent(match[1]) : '';
  }

  private detectDesktop(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return true;
    }
    const ua = navigator.userAgent || '';
    const isMobileUa = /Android|iPhone|iPad|iPod|Windows Phone|Mobile/i.test(ua);
    const smallScreen = window.innerWidth < 992;
    return !isMobileUa && !smallScreen;
  }
}
