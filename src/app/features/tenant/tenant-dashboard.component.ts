import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { RentalApplication } from '../../core/models/application.model';
import { Property } from '../../core/models/property.model';
import { ApplicationService } from '../../core/services/application.service';
import { AuthService } from '../../core/services/auth.service';
import { PropertyService } from '../../core/services/property.service';

@Component({
  selector: 'app-tenant-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tenant-dashboard.component.html',
  styleUrl: './tenant-dashboard.component.scss',
})
export class TenantDashboardComponent {
  private readonly propertyService = inject(PropertyService);
  private readonly applicationService = inject(ApplicationService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly properties = signal<Property[]>([]);
  readonly application = signal<RentalApplication | null>(null);
  readonly lookupError = signal('');
  readonly loading = signal(true);
  applicationId = '';

  constructor() {
    this.propertyService.getPublished().subscribe({
      next: (properties) => { this.properties.set(properties); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  loadApplication(): void {
    this.lookupError.set('');
    this.application.set(null);
    if (!this.applicationId.trim()) return;
    this.applicationService.getTenantApplication(this.applicationId.trim()).subscribe({
      next: (application) => this.application.set(application),
      error: () => this.lookupError.set('Unable to load that application.'),
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
}
