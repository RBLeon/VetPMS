import React, { createContext, useContext, useState, useEffect } from "react";
import { User, RegisterData } from "@/lib/api/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("vc_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("vc_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("vc_user");
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Demo credentials check
      if (email === "demo@vetpms.nl" && password === "demo123") {
        const mockUser: User = {
          id: "1",
          email,
          firstName: "Demo",
          lastName: "User",
          role: "VETERINARIAN",
          permissions: [],
          tenantId: "1",
          username: "demo",
        };
        setUser(mockUser);
        return;
      }

      // TODO: Implement actual login logic
      throw new Error("Invalid credentials");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Implement actual registration logic
      const mockUser: User = {
        id: "1",
        email: data.email,
        role: "VETERINARIAN",
        permissions: [],
        tenantId: "1",
        username: data.email,
      };
      setUser(mockUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Implement actual forgot password logic
      console.log(`Password reset requested for: ${email}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Implement actual reset password logic
      console.log(`Password reset with token: ${token}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setUser(null);
      // Clear all auth-related state from localStorage
      localStorage.removeItem("vc_user");
      localStorage.removeItem("vc_role");
      localStorage.removeItem("vc_theme");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        error,
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
