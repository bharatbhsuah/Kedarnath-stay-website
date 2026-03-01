import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div *ngIf="show" class="flex justify-center items-center py-10 sm:py-12">
      <div class="w-10 h-10 border-2 border-sand border-t-forest rounded-full animate-spin" aria-hidden="true"></div>
    </div>
  `
})
export class LoadingSpinnerComponent {
  @Input() show = false;
}

