import { validateName } from "../../../shared/helpers/validation";
import type { WordValidationErrors } from "../types/wordErrors";

/**
 * Service de validation pour les mots
 * Centralise toute la logique de validation réutilisable
 */
export const wordValidator = {
  /**
   * Valide les champs français et anglais d'un mot
   * @param frenchWord - Le mot en français
   * @param englishWord - Le mot en anglais
   * @returns Objet contenant les erreurs ou null si valide
   */
  validateWordFields(
    frenchWord: string,
    englishWord: string
  ): WordValidationErrors | null {
    const errors: WordValidationErrors = {};

    // Validation mot français
    const frenchValidation = validateName(frenchWord, "mot français");
    if (!frenchValidation.isValid) {
      errors.frenchWord = frenchValidation.message!;
    } else if (frenchWord.length < 2) {
      errors.frenchWord = "Le mot français doit contenir au moins 2 caractères";
    } else if (frenchWord.length > 100) {
      errors.frenchWord = "Le mot français ne peut pas dépasser 100 caractères";
    }

    // Validation mot anglais
    const englishValidation = validateName(englishWord, "mot anglais");
    if (!englishValidation.isValid) {
      errors.englishWord = englishValidation.message!;
    } else if (englishWord.length < 2) {
      errors.englishWord = "Le mot anglais doit contenir au moins 2 caractères";
    } else if (englishWord.length > 100) {
      errors.englishWord = "Le mot anglais ne peut pas dépasser 100 caractères";
    }

    return Object.keys(errors).length === 0 ? null : errors;
  },

  /**
   * Valide un mot français uniquement
   * @param frenchWord - Le mot en français
   * @returns Message d'erreur ou null si valide
   */
  validateFrenchWord(frenchWord: string): string | null {
    const validation = validateName(frenchWord, "mot français");
    if (!validation.isValid) {
      return validation.message!;
    }
    if (frenchWord.length < 2) {
      return "Le mot français doit contenir au moins 2 caractères";
    }
    if (frenchWord.length > 100) {
      return "Le mot français ne peut pas dépasser 100 caractères";
    }
    return null;
  },

  /**
   * Valide un mot anglais uniquement
   * @param englishWord - Le mot en anglais
   * @returns Message d'erreur ou null si valide
   */
  validateEnglishWord(englishWord: string): string | null {
    const validation = validateName(englishWord, "mot anglais");
    if (!validation.isValid) {
      return validation.message!;
    }
    if (englishWord.length < 2) {
      return "Le mot anglais doit contenir au moins 2 caractères";
    }
    if (englishWord.length > 100) {
      return "Le mot anglais ne peut pas dépasser 100 caractères";
    }
    return null;
  },
};
