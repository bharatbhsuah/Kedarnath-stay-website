import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  template: `
    <div class="flex min-h-screen">
      <aside class="admin-sidebar w-56 lg:w-60 shrink-0">
        <div class="px-4 py-4 border-b border-white/10 font-heading text-cream text-sm uppercase tracking-widest">
          Admin Panel
        </div>
        <nav class="mt-2 text-sm">
          <a routerLink="/admin/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
          <a routerLink="/admin/rooms" routerLinkActive="active">Rooms</a>
          <a routerLink="/admin/tents" routerLinkActive="active">Tents</a>
          <a routerLink="/admin/price-settings" routerLinkActive="active">Price Settings</a>
          <a routerLink="/admin/bookings" routerLinkActive="active">Bookings</a>
          <a routerLink="/admin/enquiries" routerLinkActive="active">Enquiries</a>
        </nav>
      </aside>
      <main class="flex-1 bg-cream min-w-0">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {}

