import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  CreatePropertyRequest,
  Property,
  PropertyDetail,
  UpdatePropertyRequest,
} from '../models/property.model';
import {
  CreateUnitRequest,
  Unit,
  UpdateUnitRequest,
} from '../models/unit.model';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}`;

  getPublished(): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.apiUrl}/properties/published`);
  }

  getPublishedById(id: string): Observable<PropertyDetail> {
    return this.http.get<PropertyDetail>(`${this.apiUrl}/properties/${id}`);
  }

  getOwnerProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.apiUrl}/owner/properties`);
  }

  createProperty(request: CreatePropertyRequest): Observable<Property> {
    return this.http.post<Property>(`${this.apiUrl}/owner/properties`, request);
  }

  getOwnerProperty(id: string): Observable<PropertyDetail> {
    return this.http.get<PropertyDetail>(`${this.apiUrl}/owner/properties/${id}`);
  }

  updateProperty(id: string, request: UpdatePropertyRequest): Observable<Property> {
    return this.http.put<Property>(`${this.apiUrl}/owner/properties/${id}`, request);
  }

  publishProperty(id: string): Observable<Property> {
    return this.http.post<Property>(`${this.apiUrl}/owner/properties/${id}/publish`, {});
  }

  archiveProperty(id: string): Observable<Property> {
    return this.http.post<Property>(`${this.apiUrl}/owner/properties/${id}/archive`, {});
  }

  deleteProperty(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/owner/properties/${id}`);
  }

  getUnits(propertyId: string): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.apiUrl}/owner/properties/${propertyId}/units`);
  }

  createUnit(propertyId: string, request: CreateUnitRequest): Observable<Unit> {
    return this.http.post<Unit>(`${this.apiUrl}/owner/properties/${propertyId}/units`, request);
  }

  getUnit(id: string): Observable<Unit> {
    return this.http.get<Unit>(`${this.apiUrl}/owner/units/${id}`);
  }

  updateUnit(id: string, request: UpdateUnitRequest): Observable<Unit> {
    return this.http.put<Unit>(`${this.apiUrl}/owner/units/${id}`, request);
  }

  markUnavailable(id: string): Observable<Unit> {
    return this.http.post<Unit>(`${this.apiUrl}/owner/units/${id}/mark-unavailable`, {});
  }

  archiveUnit(id: string): Observable<Unit> {
    return this.http.post<Unit>(`${this.apiUrl}/owner/units/${id}/archive`, {});
  }

  getOwnerUnit(id: string): Observable<Unit> {
    return this.http.get<Unit>(`${this.apiUrl}/units/${id}/owner-view`);
  }
}
