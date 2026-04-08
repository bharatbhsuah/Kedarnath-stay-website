import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../core/services/toast.service';

interface AdminHotel {
  id: number;
  name: string;
  city?: string | null;
  status: string;
}

@Component({
  selector: 'app-manage-hotels',
  standalone: false,
  template: `
    <section class="space-y-4">
      <div class="flex flex-wrap justify-between items-start sm:items-center gap-3">
        <div>
          <h1 class="font-heading text-2xl">Hotel Master</h1>
          <p class="text-sm text-muted mt-1">Create, edit and manage hotels/branches.</p>
        </div>
        <a routerLink="/admin/hotels/new" class="btn-primary text-xs">Add Hotel</a>
      </div>

      <app-loading-spinner [show]="loading"></app-loading-spinner>

      <div *ngIf="!loading && hotels.length === 0" class="card p-6 text-sm text-muted">
        No hotels created yet.
      </div>

      <div *ngIf="!loading && hotels.length" class="card p-3 sm:p-4">
        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>City</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let h of hotels">
                <td>{{ h.id }}</td>
                <td class="font-medium">{{ h.name }}</td>
                <td>{{ h.city || '-' }}</td>
                <td>
                  <span class="status-pill" [ngClass]="h.status === 'active' ? 'confirmed' : 'cancelled'">{{ h.status }}</span>
                </td>
                <td>
                  <div class="admin-actions">
                    <a [routerLink]="['/admin/hotels', h.id, 'edit']" class="btn-secondary text-xs">Edit</a>
                    <button class="btn-gold text-xs" (click)="toggleStatus(h)" [disabled]="isActionLoading(h.id, 'toggle')" [class.btn-loading]="isActionLoading(h.id, 'toggle')">Toggle Status</button>
                    <button class="btn-danger text-xs" (click)="delete(h)" [disabled]="isActionLoading(h.id, 'delete')" [class.btn-loading]="isActionLoading(h.id, 'delete')">Delete</button>
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
export class ManageHotelsComponent {
  hotels: AdminHotel[] = [];
  loading = false;
  activeActionKey: string | null = null;

  constructor(private http: HttpClient, private toast: ToastService) {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.http.get<AdminHotel[]>(`${environment.apiUrl}/admin/hotels`).subscribe({
      next: (hotels) => {
        this.hotels = hotels;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  toggleStatus(hotel: AdminHotel): void {
    const newStatus = hotel.status === 'active' ? 'inactive' : 'active';
    this.activeActionKey = this.actionKey(hotel.id, 'toggle');
    this.http
      .put<AdminHotel>(`${environment.apiUrl}/admin/hotels/${hotel.id}`, {
        ...hotel,
        status: newStatus
      })
      .subscribe({
        next: () => {
          this.activeActionKey = null;
          this.toast.success('Hotel updated.');
          this.load();
        },
        error: () => {
          this.activeActionKey = null;
          this.toast.error('Unable to update hotel status.');
        }
      });
  }

  delete(hotel: AdminHotel): void {
    if (!confirm('Delete this hotel?')) {
      return;
    }
    this.activeActionKey = this.actionKey(hotel.id, 'delete');
    this.http.delete(`${environment.apiUrl}/admin/hotels/${hotel.id}`).subscribe({
      next: () => {
        this.activeActionKey = null;
        this.toast.success('Hotel deleted.');
        this.load();
      },
      error: () => {
        this.activeActionKey = null;
        this.toast.error('Unable to delete hotel.');
      }
    });
  }

  private actionKey(id: number, action: 'toggle' | 'delete'): string {
    return `${action}:${id}`;
  }

  isActionLoading(id: number, action: 'toggle' | 'delete'): boolean {
    return this.activeActionKey === this.actionKey(id, action);
  }
}
