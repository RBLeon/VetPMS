import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        // Mock session check - replace with actual auth logic
        const mockUser: User = {
          id: "1",
          email: "test@example.com",
          displayName: "Test User",
          firstName: "Test",
          lastName: "User",
          avatarUrl: "https://example.com/avatar.jpg",
        };
        setUser(mockUser);
      } catch (error) {
        console.error("Session check failed:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      // Mock sign in - replace with actual auth logic
      const mockUser: User = {
        id: "1",
        email,
        displayName: email.split("@")[0],
        firstName: email.split("@")[0],
        lastName: "User",
      };
      setUser(mockUser);
      navigate("/dashboard");
    } catch (error) {
      console.error("Sign in failed:", error);
      setError("Inloggen mislukt. Probeer het opnieuw.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Mock sign out - replace with actual auth logic
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
      setError("Uitloggen mislukt. Probeer het opnieuw.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Alias functions for backward compatibility
  const login = signIn;
  const logout = signOut;

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
