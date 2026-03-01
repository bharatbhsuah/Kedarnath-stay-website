import { Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { environment } from '../../../../environments/environment';
import { CurrencyInrPipe } from '../../../shared/pipes/currency-inr.pipe';

interface AdminBooking {
  id: number;
  booking_ref: string;
  guest_name?: string;
  property_type: string;
  check_in: string;
  check_out: string;
  total_amount: number;
  status: string;
  payment_status: string;
}

@Component({
  selector: 'app-bookings-list',
  template: `
    <h1 class="font-heading text-2xl mb-4">Bookings</h1>

    <div class="card p-4 mb-4 text-sm">
      <div class="grid md:grid-cols-4 gap-3">
        <div>
          <label class="block text-xs uppercase mb-1 tracking-widest">Status</label>
          <select
            [(ngModel)]="filter.status"
            class="w-full border border-sand bg-cream px-2 py-1"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label class="block text-xs uppercase mb-1 tracking-widest">Property Type</label>
          <select
            [(ngModel)]="filter.propertyType"
            class="w-full border border-sand bg-cream px-2 py-1"
          >
            <option value="">All</option>
            <option value="room">Room</option>
            <option value="tent">Tent</option>
          </select>
        </div>

        <div>
          <label class="block text-xs uppercase mb-1 tracking-widest">From</label>
          <input
            type="date"
            [(ngModel)]="filter.from"
            class="w-full border border-sand bg-cream px-2 py-1"
          />
        </div>

        <div>
          <label class="block text-xs uppercase mb-1 tracking-widest">To</label>
          <input
            type="date"
            [(ngModel)]="filter.to"
            class="w-full border border-sand bg-cream px-2 py-1"
          />
        </div>
      </div>

      <button class="btn-primary mt-3 text-xs" (click)="load()">
        Apply Filters
      </button>
    </div>

    <app-loading-spinner [show]="loading"></app-loading-spinner>

    <div *ngIf="!loading && bookings.length === 0" class="text-sm text-muted">
      No bookings found.
    </div>

    <div *ngIf="bookings.length" class="card p-4">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm border border-sand">
          <thead class="bg-sand text-xs uppercase tracking-widest">
            <tr>
              <th class="px-3 py-2 text-left">Ref</th>
              <th class="px-3 py-2 text-left">Guest</th>
              <th class="px-3 py-2 text-left">Type</th>
              <th class="px-3 py-2 text-left">Dates</th>
              <th class="px-3 py-2 text-left">Amount</th>
              <th class="px-3 py-2 text-left">Status</th>
              <th class="px-3 py-2 text-left">Payment</th>
              <th class="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr *ngFor="let b of bookings" class="border-t border-sand">
              <td class="px-3 py-2">{{ b.booking_ref }}</td>
              <td class="px-3 py-2">{{ b.guest_name || '–' }}</td>
              <td class="px-3 py-2">{{ b.property_type }}</td>
              <td class="px-3 py-2">{{ b.check_in }} – {{ b.check_out }}</td>
              <td class="px-3 py-2">{{ b.total_amount | currencyInr }}</td>
              <td class="px-3 py-2">{{ b.status }}</td>
              <td class="px-3 py-2">{{ b.payment_status }}</td>
              <td class="px-3 py-2 space-x-2">
                <select
                  class="border border-sand bg-cream px-1 py-0.5 text-xs"
                  [value]="b.status"
                  (change)="updateStatus(b, $any($event.target).value)"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>

                <a
                  [routerLink]="['/receipt', b.id]"
                  class="btn-primary text-xs inline-block"
                >
                  Receipt
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class BookingsListComponent {
  bookings: AdminBooking[] = [];
  loading = false;

  filter = {
    status: '',
    propertyType: '',
    from: '',
    to: ''
  };

  constructor(private http: HttpClient) {
    this.load();
  }

  load(): void {
    this.loading = true;

    let params = new HttpParams();
    if (this.filter.status) params = params.set('status', this.filter.status);
    if (this.filter.propertyType) params = params.set('propertyType', this.filter.propertyType);
    if (this.filter.from) params = params.set('from', this.filter.from);
    if (this.filter.to) params = params.set('to', this.filter.to);

    this.http
      .get<AdminBooking[]>(`${environment.apiUrl}/admin/bookings`, { params })
      .subscribe({
        next: (list) => {
          this.bookings = list;
          this.loading = false;
        },
        error: () => (this.loading = false)
      });
  }

  updateStatus(b: AdminBooking, status: string): void {
    this.http
      .put(`${environment.apiUrl}/admin/bookings/${b.id}/status`, { status })
      .subscribe(() => this.load());
  }
}