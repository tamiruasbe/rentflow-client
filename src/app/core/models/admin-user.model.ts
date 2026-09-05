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
