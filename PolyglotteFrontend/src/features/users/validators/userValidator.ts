import {
  validateEmail,
  validateName,
} from "../../../shared/helpers/validation";
import type { UserValidationErrors } from "../types/userErrors";

/**
 * Service de validation pour les utilisateurs
 * Centralise toute la logique de validation réutilisable
 */
export const userValidator = {
  /**
   * Valide un nom d'utilisateur
   * @param username - Le nom d'utilisateur à valider
   * @returns Message d'erreur ou null si valide
   */
  validateUserName(username: string): string | null {
    const validation = validateName(username, "nom d'utilisateur");
    if (!validation.isValid) {
      return validation.message!;
    }
    return null;
  },

  /**
   * Valide une adresse email
   * @param email - L'email à valider
   * @returns Message d'erreur ou null si valide
   */
  validateEmail(email: string): string | null {
    if (!email.trim()) {
      return "L'email est requis";
    }
    if (!validateEmail(email)) {
      return "L'email n'est pas valide";
    }
    return null;
  },

  /**
   * Valide les champs username et email d'un utilisateur
   * @param username - Le nom d'utilisateur
   * @param email - L'email
   * @returns Objet contenant les erreurs ou null si valide
   */
  validateUserFields(
    username: string,
    email: string
  ): UserValidationErrors | null {
    const errors: UserValidationErrors = {};

    const usernameError = this.validateUserName(username);
    if (usernameError) {
      errors.username = usernameError;
    }

    const emailError = this.validateEmail(email);
    if (emailError) {
      errors.email = emailError;
    }

    return Object.keys(errors).length === 0 ? null : errors;
  },
};
