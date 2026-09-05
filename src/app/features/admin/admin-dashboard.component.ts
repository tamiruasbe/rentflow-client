import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AdminUser } from '../../core/models/admin-user.model';
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
  readonly loading = signal(true);
  readonly busyId = signal('');
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  constructor() { this.loadUsers(); }

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
