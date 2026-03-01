import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { RoomService, Room } from '../../core/services/room.service';
import { TentService, Tent } from '../../core/services/tent.service';
import { CurrencyInrPipe } from '../../shared/pipes/currency-inr.pipe';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

type PropertyType = 'room' | 'tent';

@Component({
  selector: 'app-property-detail',
  template: `
    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8" *ngIf="property">
      <div class="grid lg:grid-cols-[1.5fr,400px] gap-8 lg:gap-10">
        <div class="min-w-0">
          <div class="mb-6 rounded-card overflow-hidden">
            <div class="h-56 sm:h-72 lg:h-80 bg-sand overflow-hidden">
              <img
                *ngIf="primaryImage"
                [src]="primaryImage"
                [alt]="property.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div *ngIf="galleryImages.length" class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              <div
                *ngFor="let img of galleryImages"
                class="h-20 sm:h-24 bg-sand overflow-hidden cursor-pointer rounded-button border-2 border-transparent hover:border-forest/30 transition-colors"
                (click)="setPrimary(img)"
              >
                <img [src]="img" [alt]="property.name" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <h1 class="font-heading text-2xl sm:text-3xl text-dark mb-2">{{ property.name }}</h1>
          <div class="flex flex-wrap items-center gap-3 mb-4 text-sm text-muted">
            <span class="uppercase tracking-widest px-2.5 py-1 rounded-button bg-sand/80 text-dark font-medium">
              {{ property.type }}
            </span>
            <span>Sleeps up to {{ property.capacity }} guests</span>
          </div>
          <p class="text-muted text-sm sm:text-base leading-relaxed mb-6">
            {{ property.description }}
          </p>

          <h2 class="font-semibold text-dark mb-3">Amenities</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6 text-sm">
            <div
              *ngFor="let amenity of property.amenities"
              class="flex items-center gap-2 text-muted"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-forest shrink-0"></span>
              <span>{{ amenity }}</span>
            </div>
          </div>

          <div class="card p-4 bg-sand/30 border-sand/60">
            <h2 class="font-semibold text-dark mb-2 text-sm">Availability</h2>
            <p class="text-sm text-muted leading-relaxed">
              Select your check‑in and check‑out dates in the booking panel to see pricing. Confirmed
              bookings are blocked and cannot be double‑booked.
            </p>
          </div>
        </div>

        <aside class="lg:sticky lg:top-24 h-fit">
          <div class="card p-5 sm:p-6">
            <div class="mb-4">
              <div class="text-earth font-semibold text-xl">
                <span>{{ property.basePrice | currencyInr }}</span>
                <span class="text-sm text-muted font-normal ml-1">/ night</span>
              </div>
            </div>
            <form [formGroup]="bookingForm" (ngSubmit)="goToBooking()" class="space-y-4">
              <div>
                <label class="block text-xs uppercase tracking-widest mb-1.5 text-muted">Check-in</label>
                <input type="date" formControlName="checkIn" class="w-full" />
                <div class="text-xs text-red-600 mt-1" *ngIf="submitted && bookingForm.get('checkIn')?.invalid">
                  Check-in is required.
                </div>
              </div>
              <div>
                <label class="block text-xs uppercase tracking-widest mb-1.5 text-muted">Check-out</label>
                <input type="date" formControlName="checkOut" class="w-full" />
                <div class="text-xs text-red-600 mt-1" *ngIf="submitted && bookingForm.get('checkOut')?.invalid">
                  Check-out is required.
                </div>
              </div>
              <div>
                <label class="block text-xs uppercase tracking-widest mb-1.5 text-muted">Guests</label>
                <input type="number" min="1" formControlName="guests" class="w-full" />
                <div class="text-xs text-red-600 mt-1" *ngIf="submitted && bookingForm.get('guests')?.invalid">
                  Guests must be at least 1.
                </div>
              </div>
              <button class="btn-primary w-full mt-2" type="submit">
                Book Now
              </button>
              <div class="text-xs text-red-600" *ngIf="error">{{ error }}</div>
            </form>
          </div>
        </aside>
      </div>
    </section>
    <app-loading-spinner [show]="loading"></app-loading-spinner>
  `
})
export class PropertyDetailComponent {
  type!: PropertyType;
  id!: number;
  property!: Room | Tent;
  loading = false;
  submitted = false;
  error = '';
  primaryImage: string | null = null;
  galleryImages: string[] = [];

  bookingForm = this.fb.group({
    checkIn: ['', Validators.required],
    checkOut: ['', Validators.required],
    guests: [1, [Validators.required, Validators.min(1)]]
  });

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private tentService: TentService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.route.paramMap.subscribe((params) => {
      const typeParam = params.get('type') as PropertyType | null;
      const idParam = params.get('id');
      if (!typeParam || !idParam) {
        return;
      }
      this.type = typeParam;
      this.id = Number(idParam);
      this.loadProperty();
    });
  }

  private loadProperty(): void {
    this.loading = true;
    const obs =
      this.type === 'room'
        ? this.roomService.getRoom(this.id)
        : this.tentService.getTent(this.id);
    obs.subscribe({
      next: (prop) => {
        this.property = prop;
        const urls = (prop.images || []).map((i) => i.url);
        this.primaryImage = urls[0] || null;
        this.galleryImages = urls.slice(1);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  setPrimary(url: string): void {
    this.primaryImage = url;
  }

  goToBooking(): void {
    this.submitted = true;
    this.error = '';
    if (this.bookingForm.invalid) {
      this.error = 'Please select valid dates and guests.';
      return;
    }
    const { checkIn, checkOut, guests } = this.bookingForm.value;
    this.router.navigate(['/booking', this.type, this.id], {
      queryParams: { checkIn, checkOut, guests }
    });
  }
}

