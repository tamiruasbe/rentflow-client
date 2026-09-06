import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { PropertyService } from '../../core/services/property.service';
import { AuthService } from '../../core/services/auth.service';
import { ApplicationService } from '../../core/services/application.service';
import { RentalApplication } from '../../core/models/application.model';
import { Property } from '../../core/models/property.model';
import { Unit } from '../../core/models/unit.model';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './owner-dashboard.component.html',
  styleUrl: './owner-dashboard.component.scss',
})
export class OwnerDashboardComponent {
  private readonly fb = inject(FormBuilder);
  private readonly propertyService = inject(PropertyService);
  private readonly authService = inject(AuthService);
  private readonly applicationService = inject(ApplicationService);
  private readonly router = inject(Router);

  readonly properties = signal<Property[]>([]);
  readonly selectedProperty = signal<Property | null>(null);
  readonly units = signal<Unit[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly applications = signal<RentalApplication[]>([]);
  readonly reviewingApplicationId = signal('');

  readonly propertyForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required, Validators.maxLength(2000)]],
    propertyType: ['', [Validators.required, Validators.maxLength(100)]],
    address: ['', [Validators.required, Validators.maxLength(500)]],
    city: ['', [Validators.required, Validators.maxLength(150)]],
    amenities: [''],
  });

  readonly unitForm = this.fb.nonNullable.group({
    nameOrNumber: ['', [Validators.required, Validators.maxLength(80)]],
    bedrooms: [0, [Validators.min(0)]],
    bathrooms: [0, [Validators.min(0)]],
    monthlyRent: [0, [Validators.required, Validators.min(0.01)]],
    securityDeposit: [0, [Validators.min(0)]],
  });

  constructor() {
    this.loadProperties();
    this.loadApplications();
  }

  loadApplications(): void {
    this.applicationService.getOwnerApplications().subscribe({
      next: (applications) => this.applications.set(applications),
      error: (error) => this.showError(error, 'Unable to load rental applications.'),
    });
  }

  reviewApplication(application: RentalApplication, decision: 'approve' | 'reject'): void {
    this.reviewingApplicationId.set(application.id);
    const request = decision === 'approve'
      ? this.applicationService.approve(application.id)
      : this.applicationService.reject(application.id, 'Application rejected by owner.');
    request.subscribe({
      next: (updated) => {
        this.applications.update((items) => items.map((item) => item.id === updated.id ? updated : item));
        this.reviewingApplicationId.set('');
        this.successMessage.set(`Application ${decision}d.`);
      },
      error: (error) => {
        this.reviewingApplicationId.set('');
        this.showError(error, `Unable to ${decision} the application.`);
      },
    });
  }

  loadProperties(): void {
    this.loading.set(true);
    this.propertyService.getOwnerProperties().subscribe({
      next: (properties) => {
        this.properties.set(properties);
        this.loading.set(false);
      },
      error: (error) => this.showError(error, 'Unable to load your properties.'),
    });
  }

  createProperty(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    if (this.propertyForm.invalid) {
      this.propertyForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.propertyService.createProperty(this.propertyForm.getRawValue()).subscribe({
      next: (property) => {
        this.properties.update((items) => [property, ...items]);
        this.propertyForm.reset();
        this.saving.set(false);
        this.successMessage.set('Property created.');
      },
      error: (error) => this.showError(error, 'Unable to create the property.'),
    });
  }

  selectProperty(property: Property): void {
    this.selectedProperty.set(property);
    this.errorMessage.set('');
    this.propertyService.getUnits(property.id).subscribe({
      next: (units) => this.units.set(units),
      error: (error) => this.showError(error, 'Unable to load the units.'),
    });
  }

  createUnit(): void {
    const property = this.selectedProperty();
    if (!property || this.unitForm.invalid) {
      this.unitForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.propertyService.createUnit(property.id, this.unitForm.getRawValue()).subscribe({
      next: (unit) => {
        this.units.update((items) => [...items, unit]);
        this.unitForm.reset();
        this.saving.set(false);
        this.successMessage.set('Unit created.');
      },
      error: (error) => this.showError(error, 'Unable to create the unit.'),
    });
  }

  publishProperty(): void {
    this.changePropertyStatus('publish');
  }

  archiveProperty(): void {
    this.changePropertyStatus('archive');
  }

  deleteProperty(): void {
    const property = this.selectedProperty();
    if (!property || !confirm('Delete this property permanently?')) return;

    this.propertyService.deleteProperty(property.id).subscribe({
      next: () => {
        this.properties.update((items) => items.filter((item) => item.id !== property.id));
        this.selectedProperty.set(null);
        this.successMessage.set('Property deleted.');
      },
      error: (error) => this.showError(error, 'Unable to delete the property. Occupied properties cannot be deleted.'),
    });
  }

  markUnavailable(unit: Unit): void {
    this.propertyService.markUnavailable(unit.id).subscribe({
      next: (updated) => this.replaceUnit(updated),
      error: (error) => this.showError(error, 'Unable to update the unit.'),
    });
  }

  archiveUnit(unit: Unit): void {
    this.propertyService.archiveUnit(unit.id).subscribe({
      next: (updated) => this.replaceUnit(updated),
      error: (error) => this.showError(error, 'Unable to archive the unit.'),
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.finishLogout(),
      error: () => this.finishLogout(),
    });
  }

  private finishLogout(): void {
    this.authService.clearSession();
    void this.router.navigateByUrl('/login');
  }

  private changePropertyStatus(action: 'publish' | 'archive'): void {
    const property = this.selectedProperty();
    if (!property) return;
    const request = action === 'publish'
      ? this.propertyService.publishProperty(property.id)
      : this.propertyService.archiveProperty(property.id);
    request.subscribe({
      next: (updated) => {
        this.selectedProperty.set(updated);
        this.properties.update((items) => items.map((item) => item.id === updated.id ? updated : item));
        this.successMessage.set(`Property ${action}ed.`);
      },
      error: (error) => this.showError(error, `Unable to ${action} the property.`),
    });
  }

  private replaceUnit(updated: Unit): void {
    this.units.update((items) => items.map((unit) => unit.id === updated.id ? updated : unit));
  }

  private showError(error: { error?: { message?: string } | string }, fallback: string): void {
    this.loading.set(false);
    this.saving.set(false);
    this.errorMessage.set(typeof error?.error === 'string' ? error.error : error?.error?.message ?? fallback);
  }
}
