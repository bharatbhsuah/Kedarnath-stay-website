import { Component } from '@angular/core';
import { NgForOf } from '@angular/common';

type Tone = 'stay' | 'support' | 'account' | 'admin';

@Component({
  selector: 'app-navbar-prototype',
  template: `
    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      <div>
        <h1 class="font-heading text-3xl text-dark">Navbar Prototype</h1>
        <p class="text-sm text-muted mt-2">
          Use this page to review link variants, current-page indicator, and keyboard focus behavior.
        </p>
      </div>

      <div class="card p-5 space-y-4">
        <h2 class="font-semibold uppercase tracking-widest text-xs text-muted">Variant Library</h2>
        <div class="flex flex-wrap gap-3">
          <a
            *ngFor="let item of variants"
            href="javascript:void(0)"
            [ngClass]="['site-nav__link', toneClass(item.tone)]"
          >
            {{ item.label }}
          </a>
        </div>
      </div>

      <div class="card p-5 space-y-4">
        <h2 class="font-semibold uppercase tracking-widest text-xs text-muted">Active State</h2>
        <div class="flex flex-wrap gap-3">
          <a href="javascript:void(0)" class="site-nav__link nav-tone-stay">Rooms</a>
          <a href="javascript:void(0)" class="site-nav__link nav-tone-support is-active" aria-current="page">Contact Us</a>
          <a href="javascript:void(0)" class="site-nav__link nav-tone-account">My Bookings</a>
          <a href="javascript:void(0)" class="site-nav__link nav-tone-admin">Admin</a>
        </div>
      </div>

      <div class="card p-5 space-y-3">
        <h2 class="font-semibold uppercase tracking-widest text-xs text-muted">Focus Test</h2>
        <p class="text-sm text-muted">
          Press <kbd>Tab</kbd> to verify accessible focus rings on each navigation item.
        </p>
        <div class="flex flex-wrap gap-3">
          <a href="javascript:void(0)" class="site-nav__link nav-tone-stay">Home</a>
          <a href="javascript:void(0)" class="site-nav__link nav-tone-support">Enquiry</a>
          <a href="javascript:void(0)" class="site-nav__link nav-tone-account">Account</a>
        </div>
      </div>
    </section>
  `
})
export class NavbarPrototypeComponent {
  variants: { label: string; tone: Tone }[] = [
    { label: 'Home', tone: 'stay' },
    { label: 'Rooms', tone: 'stay' },
    { label: 'Contact Us', tone: 'support' },
    { label: 'Enquiry', tone: 'support' },
    { label: 'My Bookings', tone: 'account' },
    { label: 'Admin', tone: 'admin' }
  ];

  toneClass(tone: Tone): string {
    if (tone === 'stay') return 'nav-tone-stay';
    if (tone === 'support') return 'nav-tone-support';
    if (tone === 'account') return 'nav-tone-account';
    return 'nav-tone-admin';
  }
}

