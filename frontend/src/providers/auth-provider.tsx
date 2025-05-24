import { AuthBindings } from "@refinedev/core";
import { supabaseClient } from "@/lib/data-providers/supabase-client";

export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: new Error(error.message),
        };
      }

      if (data?.user) {
        return {
          success: true,
          redirectTo: "/dashboard",
        };
      }

      return {
        success: false,
        error: new Error("Login failed"),
      };
    } catch {
      return {
        success: false,
        error: new Error("Login failed"),
      };
    }
  },

  logout: async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        return {
          success: false,
          error: new Error(error.message),
        };
      }

      return {
        success: true,
        redirectTo: "/login",
      };
    } catch {
      return {
        success: false,
        error: new Error("Logout failed"),
      };
    }
  },

  check: async () => {
    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (session) {
        return {
          authenticated: true,
        };
      }

      return {
        authenticated: false,
        error: new Error("Not authenticated"),
        logout: true,
        redirectTo: "/login",
      };
    } catch {
      return {
        authenticated: false,
        error: new Error("Check failed"),
        logout: true,
        redirectTo: "/login",
      };
    }
  },

  getPermissions: async () => {
    try {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (user) {
        // Get user role from metadata
        const role = user.user_metadata?.role || "USER";
        return [role];
      }

      return [];
    } catch {
      return [];
    }
  },

  getIdentity: async () => {
    try {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (user) {
        return {
          id: user.id,
          name: user.user_metadata?.full_name || user.email,
          avatar: user.user_metadata?.avatar_url,
        };
      }

      return null;
    } catch {
      return null;
    }
  },

  onError: async () => {
    return {};
  },
};
