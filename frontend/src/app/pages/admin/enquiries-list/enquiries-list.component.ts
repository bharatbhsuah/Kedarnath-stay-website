import { Component } from '@angular/core';
import { NgForOf, NgIf, DatePipe } from '@angular/common';
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
    <h1 class="font-heading text-2xl mb-4">Enquiries</h1>
    <div class="mb-4 flex gap-2 text-sm">
      <button
        class="btn-primary text-xs"
        [class.bg-forest-light]="filter.status === ''"
        (click)="setStatus('')"
      >
        All
      </button>
      <button
        class="btn-primary text-xs"
        [class.bg-forest-light]="filter.status === 'new'"
        (click)="setStatus('new')"
      >
        New
      </button>
      <button
        class="btn-primary text-xs"
        [class.bg-forest-light]="filter.status === 'read'"
        (click)="setStatus('read')"
      >
        Read
      </button>
      <button
        class="btn-primary text-xs"
        [class.bg-forest-light]="filter.status === 'replied'"
        (click)="setStatus('replied')"
      >
        Replied
      </button>
    </div>
    <app-loading-spinner [show]="loading"></app-loading-spinner>
    <div *ngIf="!loading && enquiries.length === 0" class="text-sm text-muted">
      No enquiries found.
    </div>
    <div *ngIf="enquiries.length" class="card p-4">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm border border-sand">
          <thead class="bg-sand text-xs uppercase tracking-widest">
            <tr>
              <th class="px-3 py-2 text-left">Name</th>
              <th class="px-3 py-2 text-left">Email</th>
              <th class="px-3 py-2 text-left">Interested In</th>
              <th class="px-3 py-2 text-left">Guests</th>
              <th class="px-3 py-2 text-left">Message</th>
              <th class="px-3 py-2 text-left">Status</th>
              <th class="px-3 py-2 text-left">Date</th>
              <th class="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let e of enquiries" class="border-t border-sand">
              <td class="px-3 py-2">{{ e.name }}</td>
              <td class="px-3 py-2">{{ e.email }}</td>
              <td class="px-3 py-2">{{ e.interested_in || '–' }}</td>
              <td class="px-3 py-2">{{ e.approx_guests || '–' }}</td>
              <td class="px-3 py-2 max-w-xs">
                <span class="block truncate" [title]="e.message">{{ e.message }}</span>
              </td>
              <td class="px-3 py-2">{{ e.status }}</td>
              <td class="px-3 py-2">
                {{ e.created_at | date : 'short' }}
              </td>
              <td class="px-3 py-2 space-x-2">
                <button
                  class="btn-primary text-xs"
                  (click)="updateStatus(e, 'read')"
                  *ngIf="e.status === 'new'"
                >
                  Mark Read
                </button>
                <button
                  class="btn-primary text-xs"
                  (click)="updateStatus(e, 'replied')"
                  *ngIf="e.status !== 'replied'"
                >
                  Mark Replied
                </button>
                <button class="btn-gold text-xs" (click)="delete(e)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class EnquiriesListComponent {
  enquiries: AdminEnquiry[] = [];
  loading = false;
  filter: { status: string } = { status: '' };

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
}

