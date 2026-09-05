import { UnitStatus } from './unit-status';

export interface Unit {
  id: string;
  propertyId: string;
  nameOrNumber: string;
  bedrooms: number;
  bathrooms: number;
  monthlyRent: number;
  securityDeposit: number;
  status: UnitStatus | string;
}

export interface CreateUnitRequest {
  nameOrNumber: string;
  bedrooms: number;
  bathrooms: number;
  monthlyRent: number;
  securityDeposit: number;
}

export interface UpdateUnitRequest {
  nameOrNumber: string;
  bedrooms: number;
  bathrooms: number;
  monthlyRent: number;
  securityDeposit: number;
}
