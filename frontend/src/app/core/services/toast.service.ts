import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
  durationMs: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  readonly toasts$ = this.toastsSubject.asObservable();
  private nextId = 1;

  success(message: string, durationMs = 3000): void {
    this.push({ message, type: 'success', durationMs });
  }

  error(message: string, durationMs = 4500): void {
    this.push({ message, type: 'error', durationMs });
  }

  info(message: string, durationMs = 3000): void {
    this.push({ message, type: 'info', durationMs });
  }

  dismiss(id: number): void {
    this.toastsSubject.next(this.toastsSubject.value.filter((t) => t.id !== id));
  }

  private push(input: Omit<ToastMessage, 'id'>): void {
    const toast: ToastMessage = { ...input, id: this.nextId++ };
    this.toastsSubject.next([...this.toastsSubject.value, toast]);
    window.setTimeout(() => this.dismiss(toast.id), toast.durationMs);
  }
}

