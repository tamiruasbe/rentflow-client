import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { RentalApplication } from '../models/application.model';

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
}
