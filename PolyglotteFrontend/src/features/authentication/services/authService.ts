import { userApiService } from "../../users/services/userApiService";
import type { User, UserApiResponse } from "../../users/types/user";
import type { AuthResponse } from "../types/auth";
import type { LoginRequest } from "../login/types/loginRequest";
import type { RegisterRequest } from "../register/types/registerRequest";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:7081/api";

/**
 * Service d'authentification centralisé
 * Gère l'inscription, la connexion et la session utilisateur
 */
export const authService = {
  /**
   * Inscrit un nouveau utilisateur
   * @param userData - Données d'inscription
   * @returns Promise<AuthResponse>
   * @throws Error en cas d'échec
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      // Mapper les données frontend vers le format API backend
      const createUserDto = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
      };

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createUserDto),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        // Gestion des erreurs spécifiques du backend
        if (response.status === 400) {
          throw new Error(
            "Données invalides. Vérifiez le nom d'utilisateur et l'email."
          );
        } else if (response.status === 500 && errorData?.detail) {
          if (
            errorData.detail.includes("Username") &&
            errorData.detail.includes("already exists")
          ) {
            throw new Error("Ce nom d'utilisateur existe déjà");
          } else if (
            errorData.detail.includes("Email") &&
            errorData.detail.includes("already exists")
          ) {
            throw new Error("Cet email est déjà utilisé");
          }
        }

        throw new Error(
          errorData?.detail ||
            `Erreur ${response.status}: ${response.statusText}`
        );
      }

      const userResponse: UserApiResponse = await response.json();

      // Mapper les données backend vers le format frontend
      const user: User = {
        id: userResponse.id,
        username: userResponse.username || userResponse.username || "", // Support des deux formats
        password: userResponse.password,
        email: userResponse.email,
        createdAt: userResponse.createdAt,
      };

      // Simuler un token JWT (à remplacer par la vraie authentification backend)
      const mockToken = `jwt-token-${user.id}-${Date.now()}`;

      const authResponse: AuthResponse = {
        user: user,
        token: mockToken,
      };

      // Stocker dans localStorage
      this.storeAuth(authResponse);

      return authResponse;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      throw error;
    }
  },

  /**
   * Connecte un utilisateur existant
   * @param credentials - Identifiants de connexion
   * @returns Promise<AuthResponse>
   * @throws Error en cas d'échec
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // Récupération de l'utilisateur par email via userApiService
      const user = await userApiService.getByEmail(credentials.email);

      if (!user) {
        throw new Error("Email ou mot de passe incorrect");
      }

      // Validation du mot de passe
      // Note: En production, la validation devrait être faite côté backend
      if (user.password !== credentials.password) {
        throw new Error("Email ou mot de passe incorrect");
      }

      const mockToken = `jwt-token-${user.id}-${Date.now()}`;

      const authResponse: AuthResponse = {
        user: user,
        token: mockToken,
      };

      this.storeAuth(authResponse);

      return authResponse;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error;
    }
  },

  /**
   * Déconnecte l'utilisateur actuel
   */
  async logout(): Promise<void> {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  /**
   * Vérifie si un utilisateur est authentifié
   * @returns boolean
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("authToken");
  },

  /**
   * Récupère l'utilisateur actuellement connecté
   * @returns User | null
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Récupère le token d'authentification
   * @returns string | null
   */
  getAuthToken(): string | null {
    return localStorage.getItem("authToken");
  },

  /**
   * Stocke les informations d'authentification
   * @param authResponse - Réponse d'authentification
   * @private
   */
  storeAuth(authResponse: AuthResponse): void {
    localStorage.setItem("authToken", authResponse.token);
    localStorage.setItem("user", JSON.stringify(authResponse.user));
  },
};
