import { Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { environment } from '../../../../environments/environment';

interface AdminRoom {
  id: number;
  name: string;
  type: string;
  capacity: number;
  registrationAmount: number;
  arrivalAmount: number;
  totalPrice: number;
  status: string;
}

@Component({
  selector: 'app-manage-rooms',
  template: `
    <section class="space-y-4">
      <div class="flex justify-between items-center gap-3">
        <div>
          <h1 class="font-heading text-2xl">Manage Rooms</h1>
          <p class="text-sm text-muted mt-1">Room inventory grouped by hotel.</p>
        </div>
        <a routerLink="/admin/rooms/new" class="btn-primary text-xs">Add Room</a>
      </div>

      <app-loading-spinner [show]="loading"></app-loading-spinner>

      <div *ngIf="!loading && groupedRooms.length === 0" class="card p-6 text-sm text-muted">
        No rooms created yet.
      </div>

      <div *ngFor="let group of groupedRooms" class="card p-3 sm:p-4">
        <h2 class="font-semibold mb-3 text-sm uppercase tracking-widest">Hotel: {{ group.hotelName }}</h2>
        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Reg.</th>
                <th>Arrival</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of group.rooms">
                <td>{{ r.id }}</td>
                <td class="font-medium">{{ r.name }}</td>
                <td>{{ r.type }}</td>
                <td>{{ r.capacity }}</td>
                <td>{{ r.registrationAmount | currencyInr }}</td>
                <td>{{ r.arrivalAmount | currencyInr }}</td>
                <td>{{ r.totalPrice | currencyInr }}</td>
                <td>
                  <span class="status-pill" [ngClass]="r.status === 'active' ? 'confirmed' : 'cancelled'">{{ r.status }}</span>
                </td>
                <td>
                  <div class="admin-actions">
                    <a [routerLink]="['/admin/rooms', r.id, 'edit']" class="btn-secondary text-xs">Edit</a>
                    <button class="btn-gold text-xs" (click)="toggleStatus(r)">Toggle Status</button>
                    <button class="btn-danger text-xs" (click)="delete(r)">Delete</button>
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
export class ManageRoomsComponent {
  rooms: AdminRoom[] = [];
  groupedRooms: { hotelName: string; rooms: AdminRoom[] }[] = [];
  loading = false;

  constructor(private http: HttpClient) {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.http.get<AdminRoom[]>(`${environment.apiUrl}/admin/rooms`).subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        const groups = new Map<string, AdminRoom[]>();
        rooms.forEach((r: any) => {
          const name = r.hotel_name || 'Unassigned';
          if (!groups.has(name)) {
            groups.set(name, []);
          }
          groups.get(name)!.push(r);
        });
        this.groupedRooms = Array.from(groups.entries()).map(([hotelName, rs]) => ({
          hotelName,
          rooms: rs
        }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  toggleStatus(room: AdminRoom): void {
    const newStatus = room.status === 'active' ? 'inactive' : 'active';
    this.http
      .put<AdminRoom>(`${environment.apiUrl}/admin/rooms/${room.id}`, {
        ...room,
        status: newStatus
      })
      .subscribe({
        next: () => this.load(),
        error: () => {}
      });
  }

  delete(room: AdminRoom): void {
    if (!confirm('Delete this room?')) {
      return;
    }
    this.http.delete(`${environment.apiUrl}/admin/rooms/${room.id}`).subscribe({
      next: () => this.load(),
      error: () => {}
    });
  }
}
