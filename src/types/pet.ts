export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  ownerId: string;
  dateOfBirth?: string;
  lastVisit?: string;
  status: "ACTIVE" | "INACTIVE" | "DECEASED";
  needsVitalsCheck: boolean;
  createdAt: string;
  updatedAt: string;
}
