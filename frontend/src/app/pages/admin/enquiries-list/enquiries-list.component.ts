import { Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { environment } from '../../../../environments/environment';

interface AdminEnquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  interested_in?: string;
  approx_guests?: number;
  message: string;
  status: string;
  created_at: string;
}

@Component({
  selector: 'app-enquiries-list',
  template: `
    <section class="space-y-4">
      <div>
        <h1 class="font-heading text-2xl">Enquiries</h1>
        <p class="text-sm text-muted mt-1">Track lifecycle of incoming enquiries.</p>
      </div>

      <div class="card p-4">
        <div class="admin-actions">
          <button class="btn-secondary text-xs" [class.btn-primary]="filter.status === ''" (click)="setStatus('')">All</button>
          <button class="btn-secondary text-xs" [class.btn-primary]="filter.status === 'new'" (click)="setStatus('new')">New</button>
          <button class="btn-secondary text-xs" [class.btn-primary]="filter.status === 'read'" (click)="setStatus('read')">Read</button>
          <button class="btn-secondary text-xs" [class.btn-primary]="filter.status === 'replied'" (click)="setStatus('replied')">Replied</button>
        </div>
      </div>

      <app-loading-spinner [show]="loading"></app-loading-spinner>

      <div *ngIf="!loading && enquiries.length === 0" class="card p-6 text-sm text-muted">
        No enquiries found.
      </div>

      <div *ngIf="enquiries.length" class="card p-3 sm:p-4">
        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Interested In</th>
                <th>Guests</th>
                <th>Message</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let e of enquiries">
                <td class="font-medium">{{ e.name }}</td>
                <td>
                  <div>{{ e.email }}</div>
                  <div class="admin-subtext">{{ e.phone || '-' }}</div>
                </td>
                <td>{{ e.interested_in || '-' }}</td>
                <td>{{ e.approx_guests || '-' }}</td>
                <td class="max-w-xs">
                  <span class="block truncate" [title]="e.message">{{ e.message }}</span>
                </td>
                <td>
                  <span class="status-pill" [ngClass]="statusClass(e.status)">{{ e.status }}</span>
                </td>
                <td>{{ formatDateTime(e.created_at) }}</td>
                <td>
                  <div class="admin-actions">
                    <button class="btn-secondary text-xs" (click)="updateStatus(e, 'read')" *ngIf="e.status === 'new'">
                      Mark Read
                    </button>
                    <button class="btn-primary text-xs" (click)="updateStatus(e, 'replied')" *ngIf="e.status !== 'replied'">
                      Mark Replied
                    </button>
                    <button class="btn-danger text-xs" (click)="delete(e)">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `
})
export class EnquiriesListComponent {
  enquiries: AdminEnquiry[] = [];
  loading = false;
  filter: { status: string } = { status: '' };
  private readonly dateTimeFormatter = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  constructor(private http: HttpClient) {
    this.load();
  }

  setStatus(status: string): void {
    this.filter.status = status;
    this.load();
  }

  load(): void {
    this.loading = true;
    let params = new HttpParams();
    if (this.filter.status) {
      params = params.set('status', this.filter.status);
    }
    this.http
      .get<AdminEnquiry[]>(`${environment.apiUrl}/admin/enquiries`, { params })
      .subscribe({
        next: (list) => {
          this.enquiries = list;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  updateStatus(e: AdminEnquiry, status: string): void {
    this.http
      .put(`${environment.apiUrl}/admin/enquiries/${e.id}/status`, { status })
      .subscribe({
        next: () => this.load(),
        error: () => {}
      });
  }

  delete(e: AdminEnquiry): void {
    if (!confirm('Delete this enquiry?')) {
      return;
    }
    this.http.delete(`${environment.apiUrl}/admin/enquiries/${e.id}`).subscribe({
      next: () => this.load(),
      error: () => {}
    });
  }

  formatDateTime(value: string): string {
    if (!value) {
      return '-';
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return this.dateTimeFormatter.format(parsed);
  }

  statusClass(status: string): string {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'new') return 'pending';
    if (normalized === 'read') return 'read';
    if (normalized === 'replied') return 'completed';
    return 'read';
  }
}
