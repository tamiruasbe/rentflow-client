import { PropertyStatus } from './property-status';

export interface Property {
  id: string;
  name: string;
  description: string;
  propertyType: string;
  address: string;
  city: string;
  amenities: string;
  status: PropertyStatus | string;
  createdAtUtc: string;
  updatedAtUtc?: string | null;
}

export interface PropertyUnit {
  id: string;
  nameOrNumber: string;
  bedrooms: number;
  bathrooms: number;
  monthlyRent: number;
  securityDeposit: number;
  status: string;
}

export interface PropertyDetail extends Property {
  units: PropertyUnit[];
}

export interface CreatePropertyRequest {
  name: string;
  description: string;
  propertyType: string;
  address: string;
  city: string;
  amenities: string;
}

export interface UpdatePropertyRequest {
  name: string;
  description: string;
  propertyType: string;
  address: string;
  city: string;
  amenities: string;
}
