export type UserRole =
  | "VETERINARIAN"
  | "NURSE"
  | "RECEPTIONIST"
  | "MANAGER"
  | "ADMINISTRATOR";

export interface DashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  totalPatients: number;
  newPatients: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export interface DashboardWidget {
  id: string;
  type: "STATS" | "CHART" | "LIST" | "CALENDAR";
  title: string;
  data: any;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface DashboardPreferences {
  layout: "GRID" | "LIST";
  widgets: DashboardWidget[];
  theme: "LIGHT" | "DARK";
  notifications: boolean;
}

export interface SearchResult {
  id: string;
  type: "PATIENT" | "APPOINTMENT" | "MEDICAL_RECORD";
  title: string;
  description: string;
  url: string;
  icon?: string;
}

export interface UserMenuProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
  };
  onRoleChange: (role: UserRole) => void;
  onLogout: () => void;
}
