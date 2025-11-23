import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authService } from "../../features/authentication/services/authService";
import type { User } from "../../features/users/types/user";
import { AuthContext, type AuthContextType } from "./AuthContext";

/**
 * Props du provider d'authentification
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider d'authentification global
 * Gère l'état utilisateur et expose les méthodes d'authentification
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restauration de la session au chargement
  useEffect(() => {
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser && authService.isAuthenticated()) {
        setUser(currentUser);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Connecte un utilisateur
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error;
    }
  };

  /**
   * Inscrit un nouvel utilisateur
   */
  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      const response = await authService.register({
        username,
        email,
        password,
      });
      setUser(response.user);
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      throw error;
    }
  };

  /**
   * Déconnecte l'utilisateur actuel
   */
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
