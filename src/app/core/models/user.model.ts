import { AccountStatus } from './account-status';

export interface User {
  id: string;
  email: string;
  phoneNumber?: string | null;
  firstName: string;
  lastName: string;
  accountStatus: AccountStatus | string;
}
