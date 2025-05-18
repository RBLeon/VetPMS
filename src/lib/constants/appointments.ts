export const APPOINTMENT_STATUS = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const APPOINTMENT_TYPES = {
  CONSULTATION: "consultation",
  SURGERY: "surgery",
  FOLLOW_UP: "follow_up",
  VACCINATION: "vaccination",
} as const;
