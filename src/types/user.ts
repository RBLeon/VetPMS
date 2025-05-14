export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "VET" | "NURSE" | "RECEPTIONIST";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
