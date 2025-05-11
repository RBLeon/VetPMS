import type { Client } from "../types";

export const mockClients: Client[] = [
  {
    id: "1",
    firstName: "Jan",
    lastName: "de Vries",
    email: "jan@example.com",
    phone: "06-12345678",
    address: {
      street: "Hoofdstraat 123",
      city: "Amsterdam",
      state: "Noord-Holland",
      country: "Nederland",
      postalCode: "1012 AB",
    },
    preferredCommunication: "email",
    lastVisit: "2024-03-15",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "2",
    firstName: "Maria",
    lastName: "Jansen",
    email: "maria@example.com",
    phone: "06-87654321",
    address: {
      street: "Kerkstraat 45",
      city: "Rotterdam",
      state: "Zuid-Holland",
      country: "Nederland",
      postalCode: "3011 AA",
    },
    preferredCommunication: "phone",
    lastVisit: "2024-03-10",
    createdAt: "2024-01-02",
    updatedAt: "2024-01-02",
  },
];
