import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { PropertyImage } from '../../../core/services/room.service';
import { CurrencyInrPipe } from '../../pipes/currency-inr.pipe';

@Component({
  selector: 'app-property-card',
 
  template: `
    <div class="card overflow-hidden flex flex-col h-full">
      <div class="relative h-44 sm:h-52 bg-sand overflow-hidden">
        <img
          *ngIf="primaryImage"
          [src]="primaryImage.url"
          [alt]="name"
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <span class="absolute top-3 right-3 text-xs uppercase tracking-wide px-2.5 py-1 rounded-button bg-white/95 text-dark shadow-soft">
          {{ type }}
        </span>
      </div>
      <div class="p-4 sm:p-5 flex-1 flex flex-col gap-2">
        <h3 class="font-heading text-lg sm:text-xl text-dark leading-tight">{{ name }}</h3>
        <p class="text-sm text-muted">Sleeps up to {{ capacity }} guests</p>
        <div class="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-sand/60">
          <div class="text-earth font-semibold text-base">
            <span>{{ price | currencyInr }}</span>
            <span class="text-xs text-muted font-normal ml-1">/ night</span>
          </div>
          <button class="btn-primary text-xs w-full sm:w-auto" (click)="book.emit()">
            Book Now
          </button>
        </div>
      </div>
    </div>
  `
})
export class PropertyCardComponent {
  @Input() name!: string;
  @Input() type!: string;
  @Input() capacity!: number;
  @Input() price!: number;
  @Input() images: PropertyImage[] = [];
  @Output() book = new EventEmitter<void>();

  get primaryImage(): PropertyImage | null {
    if (!this.images || !this.images.length) {
      return null;
    }
    return this.images.find((i) => i.isPrimary) ?? this.images[0];
  }
}

