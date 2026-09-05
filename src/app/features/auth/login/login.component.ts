import { Component, inject, signal } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],

    password: ['', [Validators.required]],
  });

  submit(): void {
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    this.authService.login(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.loading.set(false);

        const role = response.user.role?.toLowerCase();
        const destination = role === 'admin' ? '/admin' : role === 'owner' ? '/owner' : '/tenant';
        this.router.navigate([destination]);
      },

      error: (error) => {
        this.loading.set(false);

        this.errorMessage.set(this.getLoginError(error));
      },
    });
  }

  private getLoginError(error: { error?: unknown }): string {
    if (typeof error?.error === 'string') {
      return error.error;
    }

    if (typeof error?.error === 'object' && error.error !== null && 'message' in error.error) {
      const message = (error.error as { message?: unknown }).message;
      if (typeof message === 'string') {
        return message;
      }
    }

    return 'Login failed. Please check your credentials.';
  }
}
