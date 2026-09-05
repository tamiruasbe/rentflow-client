import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { OwnerDashboardComponent } from './features/owner/owner-dashboard.component';
import { PropertyListingsComponent } from './features/public/property-listings.component';
import { PropertyDetailComponent } from './features/public/property-detail.component';
import { TenantDashboardComponent } from './features/tenant/tenant-dashboard.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: PropertyListingsComponent,
  },
  {
    path: 'properties/:id',
    component: PropertyDetailComponent,
  },
  {
    path: 'owner',
    canActivate: [authGuard, roleGuard(['Owner'])],
    component: OwnerDashboardComponent,
  },
  {
    path: 'tenant',
    canActivate: [authGuard, roleGuard(['Tenant'])],
    component: TenantDashboardComponent,
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['Admin'])],
    component: AdminDashboardComponent,
  },

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'register',
    component: RegisterComponent,
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
