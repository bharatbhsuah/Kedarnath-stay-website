import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { environment } from '../../../../environments/environment';

interface AdminTent {
  id: number;
  name: string;
  type: string;
  description?: string;
  capacity: number;
  basePrice: number;
  amenities: string[] | string | null;
  status: string;
}

@Component({
 
  selector: 'app-tent-form',
    template: `
    <section>
      <h1 class="font-heading text-2xl mb-4">
        {{ isEdit ? 'Edit Tent' : 'Add Tent' }}
      </h1>
      <form [formGroup]="form" (ngSubmit)="save()" class="card p-4 space-y-3 text-sm">
        <div>
          <label class="block text-xs uppercase mb-1 tracking-widest">Name</label>
          <input type="text" formControlName="name" />
          <div class="text-xs text-red-600" *ngIf="submitted && form.get('name')?.invalid">
            Name is required.
          </div>
        </div>
        <div>
          <label class="block text-xs uppercase mb-1 tracking-widest">Type</label>
          <select formControlName="type">
            <option value="standard">Standard</option>
            <option value="luxury">Luxury</option>
            <option value="safari">Safari</option>
            <option value="honeymoon">Honeymoon</option>
          </select>
        </div>
        <div>
          <label class="block text-xs uppercase mb-1 tracking-widest">Description</label>
          <textarea rows="3" formControlName="description"></textarea>
        </div>
        <div class="grid md:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs uppercase mb-1 tracking-widest">Capacity</label>
            <input type="number" min="1" formControlName="capacity" />
          </div>
          <div>
            <label class="block text-xs uppercase mb-1 tracking-widest">Base Price / night</label>
            <input type="number" min="0" formControlName="basePrice" />
          </div>
        </div>
        <div>
          <label class="block text-xs uppercase mb-1 tracking-widest">Amenities</label>
          <div formArrayName="amenities" class="space-y-1">
            <div *ngFor="let ctrl of amenities.controls; let i = index" class="flex gap-2">
              <input type="text" [formControlName]="i" class="flex-1" />
              <button type="button" class="btn-primary text-xs" (click)="removeAmenity(i)">
                Remove
              </button>
            </div>
          </div>
          <button type="button" class="btn-gold text-xs mt-2" (click)="addAmenity()">
            Add Amenity
          </button>
        </div>
        <div>
          <label class="block text-xs uppercase mb-1 tracking-widest">Status</label>
          <select formControlName="status">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button class="btn-primary mt-2" type="submit" [disabled]="loading">
          {{ isEdit ? 'Update Tent' : 'Create Tent' }}
        </button>
        <div class="text-xs text-red-600" *ngIf="error">{{ error }}</div>
      </form>
      <app-loading-spinner [show]="loading"></app-loading-spinner>
    </section>
  `
})
export class TentFormComponent {
  form = this.fb.group({
    name: ['', Validators.required],
    type: ['standard', Validators.required],
    description: [''],
    capacity: [2, Validators.required],
    basePrice: [0, Validators.required],
    amenities: this.fb.array<string>([]),
    status: ['active', Validators.required]
  });
  submitted = false;
  loading = false;
  error = '';
  isEdit = false;
  private id: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEdit = true;
        this.id = Number(idParam);
        this.load();
      }
    });
    if (!this.isEdit) {
      this.addAmenity();
    }
  }

  get amenities(): FormArray {
    return this.form.get('amenities') as FormArray;
  }

  addAmenity(): void {
    this.amenities.push(this.fb.control(''));
  }

  removeAmenity(index: number): void {
    this.amenities.removeAt(index);
  }

  private load(): void {
    if (!this.id) {
      return;
    }
    this.loading = true;
    this.http.get<AdminTent[]>(`${environment.apiUrl}/admin/tents`).subscribe({
      next: (tents) => {
        const tent = tents.find((t) => t.id === this.id);
        if (tent) {
          const amenitiesArray =
            typeof tent.amenities === 'string'
              ? JSON.parse(tent.amenities)
              : tent.amenities || [];
          amenitiesArray.forEach((a: string) => this.amenities.push(this.fb.control(a)));
          if (!amenitiesArray.length) {
            this.addAmenity();
          }
          this.form.patchValue({
            name: tent.name,
            type: tent.type,
            description: tent.description || '',
            capacity: tent.capacity,
            basePrice: tent.basePrice,
            status: tent.status
          });
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  save(): void {
    this.submitted = true;
    this.error = '';
    if (this.form.invalid) {
      return;
    }
    const payload = {
      ...this.form.value,
      amenities: this.amenities.value.filter((a: string) => !!a)
    };
    this.loading = true;
    const req = this.isEdit && this.id
      ? this.http.put(`${environment.apiUrl}/admin/tents/${this.id}`, payload)
      : this.http.post(`${environment.apiUrl}/admin/tents`, payload);
    req.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/admin/tents']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Unable to save tent.';
      }
    });
  }
}

