import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { environment } from '../../../../environments/environment';

interface AdminHotelOption {
  id: number;
  name: string;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  hotel_id?: number | null;
  hotel_name?: string | null;
}

@Component({
  selector: 'app-manage-users',
  standalone: false,
  template: `
    <section class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 class="font-heading text-2xl">User Master</h1>
          <p class="text-sm text-muted mt-1">Users grouped by role with hotel assignment.</p>
        </div>
        <a routerLink="/admin/users/new" class="btn-primary text-xs">Add User</a>
      </div>

      <div class="card p-4 flex items-center gap-2 text-sm max-w-md">
        <label class="text-xs uppercase tracking-widest text-muted">Hotel</label>
        <select class="text-sm flex-1" [(ngModel)]="selectedHotelId" (change)="load()">
          <option [ngValue]="null">All</option>
          <option *ngFor="let h of hotels" [ngValue]="h.id">{{ h.name }}</option>
        </select>
      </div>

      <div *ngIf="errorMessage" class="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
        {{ errorMessage }}
      </div>

      <app-loading-spinner [show]="loading"></app-loading-spinner>

      <div *ngIf="!loading && groupedUsers.length === 0" class="card p-6 text-sm text-muted">
        No users found for selected filter.
      </div>

      <div *ngFor="let group of groupedUsers" class="card p-3 sm:p-4">
        <h2 class="font-semibold mb-3 text-sm uppercase tracking-widest">{{ group.role | titlecase }}</h2>
        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Hotel</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let u of group.users">
                <td>{{ u.id }}</td>
                <td class="font-medium">{{ u.name }}</td>
                <td>{{ u.phone || '-' }}</td>
                <td>{{ u.email }}</td>
                <td>{{ u.hotel_name || '-' }}</td>
                <td>
                  <div class="admin-actions">
                    <a [routerLink]="['/admin/users', u.id, 'edit']" class="btn-secondary text-xs">Edit</a>
                    <button class="btn-danger text-xs" (click)="delete(u)">Delete</button>
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
export class ManageUsersComponent {
  users: AdminUser[] = [];
  hotels: AdminHotelOption[] = [];
  selectedHotelId: number | null = null;
  loading = false;
  errorMessage = '';
  groupedUsers: { role: string; users: AdminUser[] }[] = [];

  constructor(private http: HttpClient) {
    this.loadHotels();
    this.load();
  }

  loadHotels(): void {
    this.http.get<AdminHotelOption[]>(`${environment.apiUrl}/admin/hotels`).subscribe({
      next: (hotels) => {
        this.hotels = hotels;
      },
      error: () => {}
    });
  }

  load(): void {
    this.loading = true;
    this.errorMessage = '';
    const params: any = {};
    if (this.selectedHotelId != null) {
      params.hotelId = this.selectedHotelId;
    }
    this.http.get<AdminUser[]>(`${environment.apiUrl}/admin/users`, { params }).subscribe({
      next: (users) => {
        this.users = users;
        this.groupUsersByRole();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to load users';
        this.loading = false;
      }
    });
  }

  groupUsersByRole(): void {
    const groups = new Map<string, AdminUser[]>();

    this.users.forEach((user) => {
      const role = user.role || 'unknown';
      if (!groups.has(role)) {
        groups.set(role, []);
      }
      groups.get(role)!.push(user);
    });

    this.groupedUsers = Array.from(groups.entries()).map(([role, users]) => ({
      role,
      users
    }));
  }

  delete(user: AdminUser): void {
    if (!confirm('Delete this user?')) {
      return;
    }
    this.http.delete(`${environment.apiUrl}/admin/users/${user.id}`).subscribe({
      next: () => this.load(),
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to delete user';
      }
    });
  }
}
