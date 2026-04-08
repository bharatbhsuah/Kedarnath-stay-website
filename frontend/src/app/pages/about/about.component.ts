import { Component } from '@angular/core';
import { NgForOf } from '@angular/common';
import { environment } from '../../../environments/environment';

interface HelplineNumber {
  label: string;
  number: string;
}

@Component({
  selector: 'app-about',
  template: `
    <section class="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      <div>
        <h1 class="font-heading text-3xl sm:text-4xl text-dark mb-3">Contact Us</h1>
        <p class="text-muted leading-relaxed">
          Kedar-Stays helps travellers discover and book curated rooms and luxury tents with
          a simple booking flow, secure online payments, and real-time confirmation updates.
        </p>
      </div>

      <div class="card p-5 sm:p-6 space-y-3">
        <h2 class="font-heading text-xl text-dark">What We Offer</h2>
        <p class="text-sm text-muted leading-relaxed">
          Our website is built for smooth stay planning from search to check-in. You can compare
          options, check stay dates, view transparent pricing, and manage your bookings from one
          place.
        </p>
        <p class="text-sm text-muted leading-relaxed">
          For pilgrimage season, travellers can also use the official Char Dham and Shri Hemkund
          Sahib registration portal directly from the link shared on our Home page.
        </p>
      </div>

      <div class="card p-5 sm:p-6">
        <h2 class="font-heading text-xl text-dark mb-3">Helpline Numbers</h2>
        <div class="grid sm:grid-cols-2 gap-3">
          <div *ngFor="let helpline of helplineNumbers" class="border border-sand rounded-lg p-3 bg-cream-strong">
            <div class="text-xs uppercase tracking-widest text-muted">{{ helpline.label }}</div>
            <a
              class="text-lg font-semibold text-forest hover:underline"
              [href]="'tel:' + toTel(helpline.number)"
            >
              {{ helpline.number }}
            </a>
          </div>
        </div>
        <p class="text-xs text-muted mt-4">
          You can update these numbers any time from the environment files.
        </p>
      </div>
    </section>
  `
})
export class AboutComponent {
  helplineNumbers: HelplineNumber[] = environment.helplineNumbers || [];

  toTel(number: string): string {
    return String(number || '').replace(/[^\d+]/g, '');
  }
}

