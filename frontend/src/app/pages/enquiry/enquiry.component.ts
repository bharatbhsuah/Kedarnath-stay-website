import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { EnquiryService } from '../../core/services/enquiry.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ToastService } from '../../core/services/toast.service';

@Component({
 
  selector: 'app-enquiry',
  template: `
    <section class="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 class="font-heading text-2xl sm:text-3xl text-dark mb-2">Enquiry</h1>
      <p class="text-muted text-sm sm:text-base mb-6">
        Tell us a little about your plans and we will get back to you with tailored options.
      </p>
      <form [formGroup]="form" (ngSubmit)="submit()" class="card p-5 sm:p-6 space-y-4">
        <div>
          <label class="block text-xs uppercase mb-1.5 tracking-widest text-muted">Name</label>
          <input type="text" formControlName="name" class="w-full" />
          <div class="text-xs text-red-600 mt-1" *ngIf="submitted && form.get('name')?.invalid">
            Name is required.
          </div>
        </div>
        <div>
          <label class="block text-xs uppercase mb-1.5 tracking-widest text-muted">Email</label>
          <input type="email" formControlName="email" class="w-full" />
          <div class="text-xs text-red-600 mt-1" *ngIf="submitted && form.get('email')?.invalid">
            Valid email is required.
          </div>
        </div>
        <div>
          <label class="block text-xs uppercase mb-1.5 tracking-widest text-muted">Phone</label>
          <input type="tel" formControlName="phone" class="w-full" />
          <div class="text-xs text-red-600 mt-1" *ngIf="submitted && form.get('phone')?.invalid">
            Enter a valid 10-digit mobile number.
          </div>
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs uppercase mb-1.5 tracking-widest text-muted">Interested In</label>
            <select formControlName="interestedIn" class="w-full">
              <option value="room">Rooms</option>
              <option value="tent">Tents</option>
              <option value="both">Both</option>
              <option value="group">Group booking</option>
            </select>
          </div>
          <div>
            <label class="block text-xs uppercase mb-1.5 tracking-widest text-muted">Approx Guests</label>
            <input type="number" min="1" formControlName="approxGuests" class="w-full" />
            <div class="text-xs text-red-600 mt-1" *ngIf="submitted && form.get('approxGuests')?.invalid">
              Guests must be at least 1.
            </div>
          </div>
        </div>
        <div>
          <label class="block text-xs uppercase mb-1.5 tracking-widest text-muted">Message</label>
          <textarea rows="4" formControlName="message" class="w-full"></textarea>
          <div class="text-xs text-red-600 mt-1" *ngIf="submitted && form.get('message')?.invalid">
            Please share a short message.
          </div>
        </div>
        <button class="btn-primary w-full mt-2" type="submit" [disabled]="loading" [class.btn-loading]="loading">
          Send Enquiry
        </button>
        <div class="text-sm text-emerald-700" *ngIf="success">
          Thank you. We have received your enquiry and will get back to you shortly.
        </div>
        <div class="text-xs text-red-600" *ngIf="error">{{ error }}</div>
      </form>
      <app-loading-spinner [show]="loading"></app-loading-spinner>
    </section>
  `
})
export class EnquiryComponent {
  private readonly mobilePattern = /^[0-9]{10}$/;

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.pattern(this.mobilePattern)],
    interestedIn: ['room', Validators.required],
    approxGuests: [1, [Validators.min(1)]],
    message: ['', Validators.required]
  });
  submitted = false;
  loading = false;
  success = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private enquiryService: EnquiryService,
    private toast: ToastService
  ) {}

  submit(): void {
    this.submitted = true;
    this.success = false;
    this.error = '';
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.enquiryService.submitEnquiry(this.form.value as any).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        this.toast.success('Enquiry submitted successfully.');
        this.form.reset({
          interestedIn: 'room',
          approxGuests: 1
        });
        this.submitted = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to send enquiry. Please try again.';
        this.toast.error(this.error);
      }
    });
  }
}

