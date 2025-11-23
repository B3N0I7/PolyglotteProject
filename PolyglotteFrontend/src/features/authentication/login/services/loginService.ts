import { userValidator } from "../../../users/validators/userValidator";
import { passwordValidator } from "../../../users/validators/passwordValidator";
import { authService } from "../../services/authService";
import type { LoginRequest, LoginErrors } from "../types/loginRequest";
import type { AuthResponse } from "../../types/auth";

export const loginService = {
  /**
   * Valide les données du formulaire de login
   */
  validateCredentials(credentials: LoginRequest): LoginErrors | null {
    const errors: LoginErrors = {};

    const emailError = userValidator.validateEmail(credentials.email);
    if (emailError) {
      errors.email = emailError;
    }

    const passwordError = passwordValidator.validate(credentials.password);
    if (passwordError) {
      errors.password = passwordError;
    }

    return Object.keys(errors).length === 0 ? null : errors;
  },

  /**
   * Authentifie l'utilisateur
   */
  async authenticate(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      return await authService.login(credentials);
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error;
    }
  },

  /**
   * Gère la persistence de la session (remember me)
   */
  handleRememberMe(rememberMe: boolean): void {
    if (rememberMe) {
      // Étendre la durée de vie du token dans localStorage
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }
  },
};
