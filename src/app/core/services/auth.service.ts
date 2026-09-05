import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RefreshRequest,
  RefreshResponse,
  RegisterRequest,
} from '../models/auth.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly accessTokenKey = 'rentflow_access_token';
  private readonly refreshTokenKey = 'rentflow_refresh_token';
  private readonly userKey = 'rentflow_user';

  register(request: RegisterRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/register`, request);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => {
        this.saveSession(response);
      }),
    );
  }

  refresh(): Observable<RefreshResponse> {
    const refreshToken = this.getRefreshToken();

    const request: RefreshRequest = {
      refreshToken: refreshToken ?? '',
    };

    return this.http.post<RefreshResponse>(`${this.apiUrl}/refresh`, request).pipe(
      tap((response) => {
        localStorage.setItem(this.accessTokenKey, response.accessToken);

        localStorage.setItem(this.refreshTokenKey, response.refreshToken);
      }),
    );
  }

  logout(): Observable<unknown> {
    const refreshToken = this.getRefreshToken();

    return this.http
      .post(`${this.apiUrl}/logout`, {
        refreshToken: refreshToken ?? '',
      })
      .pipe(tap(() => this.clearSession()));
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  getStoredUser(): User | null {
    const value = localStorage.getItem(this.userKey);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as User;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  saveSession(response: AuthResponse): void {
    localStorage.setItem(this.accessTokenKey, response.accessToken);

    localStorage.setItem(this.refreshTokenKey, response.refreshToken);

    localStorage.setItem(this.userKey, JSON.stringify(response.user));

    const role = response.user.role ?? this.readRoleFromToken(response.accessToken);
    if (role) {
      localStorage.setItem('rentflow_role', role);
    }
  }

  clearSession(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem('rentflow_role');
  }

  private readRoleFromToken(token: string): string | null {
    try {
      const payload = token.split('.')[1];
      const claims = JSON.parse(atob(payload)) as Record<string, unknown>;
      const roleClaim = claims['role'] ?? claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      return typeof roleClaim === 'string' ? roleClaim : null;
    } catch {
      return null;
    }
  }
}
