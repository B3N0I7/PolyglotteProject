import { userValidator } from "../../../users/validators/userValidator";
import { passwordValidator } from "../../../users/validators/passwordValidator";
import { authService } from "../../services/authService";
import type {
  RegisterRequest,
  RegisterErrors,
  RegisterFormData,
} from "../types/registerRequest";
import type { AuthResponse } from "../../types/auth";

export const registerService = {
  /**
   * Valide les données du formulaire d'inscription
   */
  validateRegistrationData(formData: RegisterFormData): RegisterErrors | null {
    const errors: RegisterErrors = {};

    // Validation username
    const usernameError = userValidator.validateUserName(formData.username);
    if (usernameError) {
      errors.username = usernameError;
    }

    // Validation email
    const emailError = userValidator.validateEmail(formData.email);
    if (emailError) {
      errors.email = emailError;
    }

    // Validation mot de passe
    const passwordError = passwordValidator.validate(formData.password);
    if (passwordError) {
      errors.password = passwordError;
    }

    // Validation confirmation mot de passe
    const confirmError = passwordValidator.validateConfirmation(
      formData.password,
      formData.confirmPassword
    );
    if (confirmError) {
      errors.confirmPassword = confirmError;
    }

    // Validation acceptation des conditions
    if (!formData.acceptTerms) {
      errors.acceptTerms = "Vous devez accepter les conditions d'utilisation";
    }

    return Object.keys(errors).length === 0 ? null : errors;
  },

  /**
   * Crée un nouveau compte utilisateur
   */
  async createAccount(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      return await authService.register(userData);
    } catch (error) {
      console.error("Erreur lors de la création du compte:", error);
      throw error;
    }
  },

  /**
   * Vérifie la force du mot de passe en temps réel
   */
  getPasswordStrength(password: string): {
    score: number;
    message: string;
    color: string;
  } {
    return passwordValidator.getStrength(password);
  },
};
