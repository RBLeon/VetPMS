import type { Client } from "../types";

export const mockClients: Client[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      country: "USA",
      postalCode: "10001",
    },
    preferredCommunication: "email",
    lastVisit: "2024-03-15",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    phone: "098-765-4321",
    address: {
      street: "456 Oak St",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      postalCode: "90001",
    },
    preferredCommunication: "phone",
    lastVisit: "2024-03-10",
    createdAt: "2024-01-02",
    updatedAt: "2024-01-02",
  },
];
