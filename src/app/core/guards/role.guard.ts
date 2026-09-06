import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getStoredUser();

    if (!user) {
      return router.createUrlTree(['/login']);
    }

    // The backend supplies roles in JWT claims.
    // We keep the user's role separately in the frontend
    // once login response is extended to include it.
    const role = localStorage.getItem('rentflow_role');

    if (role && allowedRoles.some((allowedRole) => allowedRole.toLowerCase() === role.toLowerCase())) {
      return true;
    }

    return router.createUrlTree(['/']);
  };
};
