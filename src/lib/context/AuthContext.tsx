import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  role?: string; // Added for role-based UI adaptation
}

export interface UserRole {
  id: string;
  name: string;
  tenantId: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  backendType: "animana" | "VetPMS";
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  toggleBackendType: () => void;
  hasPermission: (permission: string, tenantId?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendType, setBackendType] = useState<"animana" | "VetPMS">(
    "animana"
  );

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        // In real app, validate token with API
        const storedUser = localStorage.getItem("vc_user");
        const storedBackend = localStorage.getItem("vc_backend");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
          if (storedBackend === "VetPMS") {
            setBackendType("VetPMS");
          }
        }
      } catch {
        setError("Authentication session expired");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock authentication - would be replaced with real API call
      if (username === "demo" && password === "demo") {
        const mockUser: User = {
          id: "1",
          username: "demo",
          email: "demo@VetPMS.example",
          firstName: "Demo",
          lastName: "User",
          roles: [
            {
              id: "1",
              name: "Veterinarian",
              tenantId: "2", // Amsterdam clinic
              permissions: [
                "appointments.read",
                "appointments.write",
                "patients.read",
                "patients.write",
                "medical_records.read",
                "medical_records.write",
              ],
            },
          ],
        };

        setUser(mockUser);
        localStorage.setItem("vc_user", JSON.stringify(mockUser));
        localStorage.setItem("vc_backend", backendType);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("vc_user");
  };

  const toggleBackendType = () => {
    const newType = backendType === "animana" ? "VetPMS" : "animana";
    setBackendType(newType);
    localStorage.setItem("vc_backend", newType);
  };

  const hasPermission = (permission: string, tenantId?: string): boolean => {
    if (!user) return false;

    return user.roles.some((role) => {
      // Check if role is for the specified tenant or any tenant if not specified
      const tenantMatch = tenantId ? role.tenantId === tenantId : true;
      return tenantMatch && role.permissions.includes(permission);
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    backendType,
    login,
    logout,
    toggleBackendType,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
