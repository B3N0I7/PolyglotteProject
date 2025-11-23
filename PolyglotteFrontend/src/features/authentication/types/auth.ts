import type { User } from "../../users/types/user";

/**
 * Réponse d'authentification retournée après login ou register
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * État de l'authentification dans l'application
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
