import type { ClientFeedback } from "../types";

export const mockClientFeedback: ClientFeedback[] = [
  {
    id: "1",
    clientId: "1",
    appointmentId: "1",
    rating: 5,
    comment:
      "Zeer tevreden over de behandeling van mijn hond Max. De dierenarts was professioneel en vriendelijk.",
    category: "SERVICE",
    status: "AFGEHANDELD",
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    clientId: "2",
    appointmentId: "2",
    rating: 4,
    comment: "Goede service, maar wachttijd was iets te lang.",
    category: "PERSONEEL",
    status: "BEKEKEN",
    createdAt: "2024-03-14T10:00:00Z",
    updatedAt: "2024-03-14T10:00:00Z",
  },
  {
    id: "3",
    clientId: "3",
    appointmentId: "3",
    rating: 5,
    comment: "Uitstekende faciliteiten en zeer hygiënisch.",
    category: "FACILITEIT",
    status: "IN_AFWACHTING",
    createdAt: "2024-03-13T10:00:00Z",
    updatedAt: "2024-03-13T10:00:00Z",
  },
];
