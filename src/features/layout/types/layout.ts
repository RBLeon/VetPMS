import { UserRole } from "../../dashboard/types/dashboard";

export interface LayoutProps {
  children: React.ReactNode;
}

export interface HeaderProps {
  user?: {
    name: string;
    role: UserRole;
    avatar?: string;
  };
  onLogout?: () => void;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  permissions?: string[];
  children?: NavigationItem[];
}

export interface ContextPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface ContextAwareNavigationProps {
  items: NavigationItem[];
  userRole: UserRole;
  userPermissions: string[];
  onNavigate: (path: string) => void;
}

export interface LayoutState {
  isContextPanelOpen: boolean;
  isMobileMenuOpen: boolean;
  activePath: string;
}
