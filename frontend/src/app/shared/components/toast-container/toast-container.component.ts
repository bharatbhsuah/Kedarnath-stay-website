import { Component } from '@angular/core';
import { ToastMessage, ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  template: `
    <div class="fixed top-20 right-4 z-[120] w-[min(92vw,360px)] space-y-2">
      <div
        *ngFor="let toast of toasts"
        class="rounded-md border px-3 py-2 shadow-card text-sm flex items-start justify-between gap-3 bg-white"
        [ngClass]="{
          'border-emerald-300 text-emerald-900': toast.type === 'success',
          'border-red-300 text-red-900': toast.type === 'error',
          'border-blue-300 text-blue-900': toast.type === 'info'
        }"
      >
        <span class="leading-5">{{ toast.message }}</span>
        <button
          type="button"
          class="text-xs opacity-80 hover:opacity-100"
          (click)="dismiss(toast.id)"
          aria-label="Close notification"
        >
          Close
        </button>
      </div>
    </div>
  `
})
export class ToastContainerComponent {
  toasts: ToastMessage[] = [];

  constructor(private toastService: ToastService) {
    this.toastService.toasts$.subscribe((toasts) => {
      this.toasts = toasts;
    });
  }

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}

