import { AccountStatus } from './account-status';

export interface AdminUser {
  id: string;
  email: string;
  phoneNumber?: string | null;
  firstName: string;
  lastName: string;
  role: 'Admin' | 'Owner' | 'Tenant' | string;
  accountStatus: AccountStatus | string;
  createdAtUtc: string;
  updatedAtUtc?: string | null;
}

export interface AdminProperty {
  id: string;
  ownerId: string;
  ownerName?: string | null;
  name: string;
  address: string;
  city: string;
  status: string;
  unitCount: number;
  occupiedUnitCount: number;
}

export interface AdminApplication {
  id: string;
  status: string;
  tenantId: string;
  tenantName?: string | null;
  propertyId: string;
  propertyName: string;
  unitNameOrNumber: string;
  submittedAtUtc: string;
  reviewedAtUtc?: string | null;
}
