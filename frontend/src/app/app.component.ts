// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   standalone: false,
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.scss',
// })
// export class AppComponent {
//   title = 'tent-website-base-frontend';
// }


import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',

  template: `
    <div class="min-h-screen flex flex-col">
      <app-navbar></app-navbar>
      <div *ngIf="!isAdmin" class="site-banner relative">
        <marquee class="site-banner__marquee" behavior="scroll" direction="left" scrollamount="6">
          Official Char Dham & Hemkund Sahib Yatra Registration Portal Using Web Portal:
          <a
            [href]="yatraRegistrationUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 font-semibold hover:underline"
          >
            Chardham & Shri Hemkund Sahib Yatra Registration
          </a>
        </marquee>
      </div>
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
      <app-toast-container></app-toast-container>
      <app-footer></app-footer>
    </div>
  `
})
export class AppComponent {
  isAdmin = false;
  yatraRegistrationUrl = environment.yatraRegistrationUrl;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = event.urlAfterRedirects;
        this.isAdmin = url.startsWith('/admin') || url.startsWith('/login') || url.startsWith('/register');
      });
  }
}

