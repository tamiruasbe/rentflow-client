export interface RentalApplication {
  id: string;
  tenantId: string;
  unitId: string;
  unitNameOrNumber: string;
  propertyName: string;
  employmentInformation: string;
  numberOfOccupants: number;
  preferredMoveInDate: string;
  message: string;
  status: string;
  submittedAtUtc: string;
  reviewedAtUtc?: string | null;
  decisionReason?: string | null;
  tenantFullName?: string | null;
  tenantPhoneNumber?: string | null;
  tenantEmail?: string | null;
  ownerFullName?: string | null;
  ownerPhoneNumber?: string | null;
  propertyDescription?: string;
  propertyType?: string;
  propertyAddress?: string;
  propertyCity?: string;
  propertyStatus?: string;
}

export interface CreateRentalApplicationRequest {
  unitId: string;
  employmentInformation: string;
  numberOfOccupants: number;
  preferredMoveInDate: string;
  message: string;
}
