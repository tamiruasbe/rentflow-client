export interface RentalApplication {
  id: string;
  tenantId: string;
  unitId: string;
  employmentInformation: string;
  numberOfOccupants: number;
  preferredMoveInDate: string;
  message: string;
  status: string;
  submittedAtUtc: string;
  reviewedAtUtc?: string | null;
  decisionReason?: string | null;
}
