import { validatePassword } from "../../../shared/helpers/validation";

/**
 * Indicateur de force du mot de passe
 */
export interface PasswordStrength {
  score: number;
  message: string;
  color: string;
}

/**
 * Service de validation pour les mots de passe
 * Centralise toute la logique de validation des mots de passe
 */
export const passwordValidator = {
  /**
   * Valide un mot de passe
   * @param password - Le mot de passe à valider
   * @returns Message d'erreur ou null si valide
   */
  validate(password: string): string | null {
    const validation = validatePassword(password);
    if (!validation.isValid) {
      return validation.message!;
    }
    return null;
  },

  /**
   * Valide la confirmation du mot de passe
   * @param password - Le mot de passe original
   * @param confirmPassword - La confirmation du mot de passe
   * @returns Message d'erreur ou null si valide
   */
  validateConfirmation(
    password: string,
    confirmPassword: string
  ): string | null {
    if (!confirmPassword.trim()) {
      return "La confirmation du mot de passe est requise";
    }
    if (password !== confirmPassword) {
      return "Les mots de passe ne correspondent pas";
    }
    return null;
  },

  /**
   * Évalue la force d'un mot de passe
   * @param password - Le mot de passe à évaluer
   * @returns Objet contenant le score, message et couleur
   */
  getStrength(password: string): PasswordStrength {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    score = Object.values(checks).filter(Boolean).length;

    if (score < 3) {
      return { score, message: "Faible", color: "#e74c3c" };
    } else if (score < 4) {
      return { score, message: "Moyen", color: "#f39c12" };
    } else {
      return { score, message: "Fort", color: "#27ae60" };
    }
  },
};
