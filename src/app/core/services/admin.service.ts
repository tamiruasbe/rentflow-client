import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AdminApplication, AdminProperty, AdminUser } from '../models/admin-user.model';

export interface AccountStatusChange {
  message: string;
  userId: string;
  accountStatus: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin`;

  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/users`);
  }

  activateUser(id: string): Observable<AccountStatusChange> {
    return this.http.post<AccountStatusChange>(`${this.apiUrl}/users/${id}/activate`, {});
  }

  suspendUser(id: string): Observable<AccountStatusChange> {
    return this.http.post<AccountStatusChange>(`${this.apiUrl}/users/${id}/suspend`, {});
  }

  deactivateUser(id: string): Observable<AccountStatusChange> {
    return this.http.post<AccountStatusChange>(`${this.apiUrl}/users/${id}/deactivate`, {});
  }

  getProperties(): Observable<AdminProperty[]> {
    return this.http.get<AdminProperty[]>(`${this.apiUrl}/properties`);
  }

  getApplications(): Observable<AdminApplication[]> {
    return this.http.get<AdminApplication[]>(`${this.apiUrl}/applications`);
  }

  suspendProperty(id: string): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/properties/${id}/suspend`, {});
  }

  removeProperty(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/properties/${id}`);
  }
}
