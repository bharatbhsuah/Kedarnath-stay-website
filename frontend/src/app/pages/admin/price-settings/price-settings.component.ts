import { Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { environment } from '../../../../environments/environment';

interface PriceSetting {
  id: number;
  property_type: 'room' | 'tent';
  property_id: number;
  season: string;
  price_per_night: number;
  weekend_surcharge: number;
  tax_percent: number;
}

@Component({
  selector: 'app-price-settings',
  template: `
    <section class="space-y-4">
      <h1 class="font-heading text-2xl">Price Settings</h1>
      <app-loading-spinner [show]="loading"></app-loading-spinner>

      <div class="grid xl:grid-cols-[2fr,1fr] gap-6">
        <div class="card p-3 sm:p-4">
          <h2 class="font-semibold mb-3 text-sm uppercase tracking-widest">Existing Rules</h2>
          <div *ngIf="!loading && settings.length === 0" class="text-sm text-muted p-3">
            No price rules defined yet.
          </div>
          <div *ngIf="settings.length" class="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Property ID</th>
                  <th>Season</th>
                  <th>Price</th>
                  <th>Weekend</th>
                  <th>Tax %</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let s of settings">
                  <td>{{ s.property_type }}</td>
                  <td>{{ s.property_id }}</td>
                  <td>{{ s.season }}</td>
                  <td>{{ s.price_per_night }}</td>
                  <td>{{ s.weekend_surcharge }}</td>
                  <td>{{ s.tax_percent }}</td>
                  <td>
                    <div class="admin-actions">
                      <button class="btn-secondary text-xs" (click)="editSetting(s)">Edit</button>
                      <button class="btn-danger text-xs" (click)="deleteSetting(s)">Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card p-4">
          <h2 class="font-semibold mb-3 text-sm uppercase tracking-widest">{{ editing ? 'Edit Rule' : 'Add Rule' }}</h2>
          <form [formGroup]="form" (ngSubmit)="save()" class="space-y-3 text-sm">
            <div>
              <label class="block text-xs uppercase mb-1 tracking-widest text-muted">Property Type</label>
              <select formControlName="property_type">
                <option value="room">Room</option>
                <option value="tent">Tent</option>
              </select>
            </div>
            <div>
              <label class="block text-xs uppercase mb-1 tracking-widest text-muted">Property ID</label>
              <input type="number" min="1" formControlName="property_id" />
            </div>
            <div>
              <label class="block text-xs uppercase mb-1 tracking-widest text-muted">Season</label>
              <select formControlName="season">
                <option value="all">All</option>
                <option value="peak">Peak</option>
                <option value="off">Off</option>
              </select>
            </div>
            <div>
              <label class="block text-xs uppercase mb-1 tracking-widest text-muted">Price / Night</label>
              <input type="number" min="0" formControlName="price_per_night" />
            </div>
            <div>
              <label class="block text-xs uppercase mb-1 tracking-widest text-muted">Weekend Surcharge</label>
              <input type="number" min="0" formControlName="weekend_surcharge" />
            </div>
            <div>
              <label class="block text-xs uppercase mb-1 tracking-widest text-muted">Tax %</label>
              <input type="number" min="0" formControlName="tax_percent" />
            </div>
            <button class="btn-primary w-full mt-2" type="submit">{{ editing ? 'Update Rule' : 'Create Rule' }}</button>
            <div class="text-xs text-red-600" *ngIf="error">{{ error }}</div>
          </form>
        </div>
      </div>
    </section>
  `
})
export class PriceSettingsComponent {
  settings: PriceSetting[] = [];
  loading = false;
  editing: PriceSetting | null = null;
  error = '';

  form = this.fb.group({
    property_type: ['room', Validators.required],
    property_id: [1, Validators.required],
    season: ['all', Validators.required],
    price_per_night: [0, Validators.required],
    weekend_surcharge: [0],
    tax_percent: [18]
  });

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.http.get<PriceSetting[]>(`${environment.apiUrl}/admin/price-settings`).subscribe({
      next: (data) => {
        this.settings = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  editSetting(s: PriceSetting): void {
    this.editing = s;
    this.form.patchValue(s);
  }

  deleteSetting(s: PriceSetting): void {
    if (!confirm('Delete this price rule?')) {
      return;
    }
    this.http.delete(`${environment.apiUrl}/admin/price-settings/${s.id}`).subscribe({
      next: () => this.load(),
      error: () => {}
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.error = 'Please fill all required fields.';
      return;
    }
    this.error = '';
    const payload = this.form.value;
    const req = this.editing
      ? this.http.put(`${environment.apiUrl}/admin/price-settings/${this.editing.id}`, payload)
      : this.http.post(`${environment.apiUrl}/admin/price-settings`, payload);
    req.subscribe({
      next: () => {
        this.editing = null;
        this.form.reset({
          property_type: 'room',
          property_id: 1,
          season: 'all',
          price_per_night: 0,
          weekend_surcharge: 0,
          tax_percent: 18
        });
        this.load();
      },
      error: () => {
        this.error = 'Unable to save rule.';
      }
    });
  }
}
