import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PropertyDetail } from '../../core/models/property.model';
import { PropertyService } from '../../core/services/property.service';
import { ApplicationService } from '../../core/services/application.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.scss',
})
export class PropertyDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly propertyService = inject(PropertyService);
  private readonly applicationService = inject(ApplicationService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  readonly property = signal<PropertyDetail | null>(null);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly applyingUnitId = signal('');
  readonly applicationForm = this.fb.nonNullable.group({
    employmentInformation: ['', [Validators.required, Validators.maxLength(2000)]],
    numberOfOccupants: [1, [Validators.required, Validators.min(1)]],
    preferredMoveInDate: ['', Validators.required],
    message: ['', [Validators.required, Validators.maxLength(2000)]],
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage.set('Property not found.');
      this.loading.set(false);
      return;
    }
    this.propertyService.getPublishedById(id).subscribe({
      next: (property) => { this.property.set(property); this.loading.set(false); },
      error: () => { this.errorMessage.set('Unable to load this property.'); this.loading.set(false); },
    });
  }

  isTenant(): boolean {
    const user = this.authService.getStoredUser();
    return user?.role?.toLowerCase() === 'tenant' &&
      user.accountStatus?.toString().toLowerCase() === 'active';
  }

  canApply(): boolean {
    return this.isTenant() && this.authService.isAuthenticated();
  }

  apply(unitId: string): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    if (this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      return;
    }

    this.applyingUnitId.set(unitId);
    this.applicationService.create({
      unitId,
      ...this.applicationForm.getRawValue(),
    }).subscribe({
      next: () => {
        this.successMessage.set('Application submitted successfully.');
        this.applicationForm.reset({ numberOfOccupants: 1 });
        this.applyingUnitId.set('');
      },
      error: (error) => {
        this.errorMessage.set(error?.error?.message ?? error?.error ?? 'Unable to submit application.');
        this.applyingUnitId.set('');
      },
    });
  }
}
