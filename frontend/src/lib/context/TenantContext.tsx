import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface Tenant {
  id: string;
  name: string;
  code: string;
  type: "FRANCHISE" | "PRACTICE" | "DEPARTMENT";
  parentId?: string;
  isActive: boolean;
}

interface TenantContextType {
  currentTenant: Tenant | null;
  accessibleTenants: Tenant[];
  setCurrentTenant: (tenant: Tenant) => void;
  isLoading: boolean;
  error: string | null;
  hasAccess: (tenantId: string) => boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [accessibleTenants, setAccessibleTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real application, this would fetch from an API
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        // Mock data for now - would be replaced with API call
        const mockTenants: Tenant[] = [
          {
            id: "1",
            name: "VetPMS Main Franchise",
            code: "VC-MAIN",
            type: "FRANCHISE",
            isActive: true,
          },
          {
            id: "2",
            name: "Amsterdam Central Clinic",
            code: "VC-AMS-1",
            type: "PRACTICE",
            parentId: "1",
            isActive: true,
          },
          {
            id: "3",
            name: "Rotterdam South Clinic",
            code: "VC-ROT-1",
            type: "PRACTICE",
            parentId: "1",
            isActive: true,
          },
        ];

        setAccessibleTenants(mockTenants);

        // Set default tenant (would be determined by user preference or role)
        const defaultTenant =
          mockTenants.find((t) => t.type === "PRACTICE") || mockTenants[0];
        setCurrentTenant(defaultTenant);

        setIsLoading(false);
      } catch {
        setError("Failed to load tenant information");
        setIsLoading(false);
      }
    };

    fetchTenants();
  }, []);

  const hasAccess = (tenantId: string): boolean => {
    return accessibleTenants.some((tenant) => tenant.id === tenantId);
  };

  const value = {
    currentTenant,
    accessibleTenants,
    setCurrentTenant,
    isLoading,
    error,
    hasAccess,
  };

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
};

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};
