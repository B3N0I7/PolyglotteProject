import { createContext, useContext } from "react";
import type { User } from "../../features/users/types/user";

/**
 * Type du contexte d'authentification
 */
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

/**
 * Context d'authentification
 */
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

/**
 * Hook pour accéder au contexte d'authentification
 * @throws Error si utilisé hors d'un AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
