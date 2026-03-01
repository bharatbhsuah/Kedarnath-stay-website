import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

import { HomeComponent } from './pages/home/home.component';
import { RoomSearchComponent } from './pages/room-search/room-search.component';
import { TentSearchComponent } from './pages/tent-search/tent-search.component';
import { PropertyDetailComponent } from './pages/property-detail/property-detail.component';
import { BookingComponent } from './pages/booking/booking.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { ReceiptComponent } from './pages/receipt/receipt.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { EnquiryComponent } from './pages/enquiry/enquiry.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AdminLayoutComponent } from './pages/admin/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ManageRoomsComponent } from './pages/admin/manage-rooms/manage-rooms.component';
import { RoomFormComponent } from './pages/admin/room-form/room-form.component';
import { ManageTentsComponent } from './pages/admin/manage-tents/manage-tents.component';
import { TentFormComponent } from './pages/admin/tent-form/tent-form.component';
import { PriceSettingsComponent } from './pages/admin/price-settings/price-settings.component';
import { BookingsListComponent } from './pages/admin/bookings-list/bookings-list.component';
import { EnquiriesListComponent } from './pages/admin/enquiries-list/enquiries-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'rooms', component: RoomSearchComponent },
  { path: 'tents', component: TentSearchComponent },
  { path: 'property/:type/:id', component: PropertyDetailComponent },
  {
    path: 'booking/:type/:id',
    canActivate: [AuthGuard],
    component: BookingComponent
  },
  {
    path: 'payment/:bookingId',
    canActivate: [AuthGuard],
    component: PaymentComponent
  },
  {
    path: 'receipt/:bookingId',
    canActivate: [AuthGuard],
    component: ReceiptComponent
  },
  {
    path: 'my-bookings',
    canActivate: [AuthGuard],
    component: MyBookingsComponent
  },
  { path: 'enquiry', component: EnquiryComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'rooms', component: ManageRoomsComponent },
      { path: 'rooms/new', component: RoomFormComponent },
      { path: 'rooms/:id/edit', component: RoomFormComponent },
      { path: 'tents', component: ManageTentsComponent },
      { path: 'tents/new', component: TentFormComponent },
      { path: 'tents/:id/edit', component: TentFormComponent },
      { path: 'price-settings', component: PriceSettingsComponent },
      { path: 'bookings', component: BookingsListComponent },
      { path: 'enquiries', component: EnquiriesListComponent },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
