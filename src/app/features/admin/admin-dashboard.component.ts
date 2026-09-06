import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AdminApplication, AdminProperty, AdminUser } from '../../core/models/admin-user.model';
import { AdminService } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  private readonly adminService = inject(AdminService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly users = signal<AdminUser[]>([]);
  readonly properties = signal<AdminProperty[]>([]);
  readonly applications = signal<AdminApplication[]>([]);
  readonly loading = signal(true);
  readonly busyId = signal('');
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  constructor() {
    this.loadUsers();
    this.adminService.getProperties().subscribe({ next: (items) => this.properties.set(items) });
    this.adminService.getApplications().subscribe({ next: (items) => this.applications.set(items) });
  }

  suspendProperty(property: AdminProperty): void {
    this.adminService.suspendProperty(property.id).subscribe({
      next: () => this.properties.update((items) => items.map((item) => item.id === property.id ? { ...item, status: 'Suspended' } : item)),
      error: (error) => this.errorMessage.set(error?.error?.message ?? 'Unable to suspend property.'),
    });
  }

  removeProperty(property: AdminProperty): void {
    if (!confirm(`Remove ${property.name}?`)) return;
    this.adminService.removeProperty(property.id).subscribe({
      next: () => this.properties.update((items) => items.filter((item) => item.id !== property.id)),
      error: (error) => this.errorMessage.set(error?.error?.message ?? 'Unable to remove property.'),
    });
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (users) => { this.users.set(users); this.loading.set(false); },
      error: (error) => { this.errorMessage.set(error?.error?.message ?? 'Unable to load users.'); this.loading.set(false); },
    });
  }

  changeStatus(user: AdminUser, action: 'activate' | 'suspend' | 'deactivate'): void {
    this.busyId.set(user.id);
    const request = action === 'activate' ? this.adminService.activateUser(user.id)
      : action === 'suspend' ? this.adminService.suspendUser(user.id)
      : this.adminService.deactivateUser(user.id);
    request.subscribe({
      next: (result) => {
        this.users.update((items) => items.map((item) => item.id === user.id ? { ...item, accountStatus: result.accountStatus } : item));
        this.successMessage.set(result.message);
        this.busyId.set('');
      },
      error: (error) => { this.errorMessage.set(error?.error?.message ?? error?.error ?? 'Unable to update user.'); this.busyId.set(''); },
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
