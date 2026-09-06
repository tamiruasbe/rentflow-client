import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CreateRentalApplicationRequest, RentalApplication } from '../models/application.model';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/rental-applications`;

  getOwnerApplication(id: string): Observable<RentalApplication> {
    return this.http.get<RentalApplication>(`${this.apiUrl}/${id}/owner-view`);
  }

  getTenantApplication(id: string): Observable<RentalApplication> {
    return this.http.get<RentalApplication>(`${this.apiUrl}/${id}/tenant-view`);
  }

  getMine(): Observable<RentalApplication[]> {
    return this.http.get<RentalApplication[]>(`${this.apiUrl}/mine`);
  }

  getOwnerApplications(): Observable<RentalApplication[]> {
    return this.http.get<RentalApplication[]>(`${this.apiUrl}/owner`);
  }

  create(request: CreateRentalApplicationRequest): Observable<RentalApplication> {
    return this.http.post<RentalApplication>(this.apiUrl, request);
  }

  approve(id: string): Observable<RentalApplication> {
    return this.http.post<RentalApplication>(`${this.apiUrl}/${id}/approve`, {});
  }

  reject(id: string, decisionReason: string): Observable<RentalApplication> {
    return this.http.post<RentalApplication>(`${this.apiUrl}/${id}/reject`, { decisionReason });
  }
}
