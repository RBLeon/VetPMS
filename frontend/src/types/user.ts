export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "VET" | "NURSE" | "RECEPTIONIST";
  createdAt: string;
  updatedAt: string;
}
