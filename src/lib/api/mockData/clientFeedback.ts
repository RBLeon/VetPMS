import type { ClientFeedback } from "../types";

export const mockClientFeedback: ClientFeedback[] = [
  {
    id: "1",
    clientId: "1",
    rating: 5,
    comment: "Excellent service! The staff was very professional and caring.",
    category: "SERVICE",
    status: "REVIEWED",
    appointmentId: "1",
    createdAt: "2024-03-19T10:00:00Z",
    updatedAt: "2024-03-19T10:00:00Z",
  },
  {
    id: "2",
    clientId: "2",
    rating: 4,
    comment: "Good experience overall. Could improve on wait times.",
    category: "SERVICE",
    status: "PENDING",
    appointmentId: "2",
    createdAt: "2024-03-18T10:00:00Z",
    updatedAt: "2024-03-18T10:00:00Z",
  },
];
