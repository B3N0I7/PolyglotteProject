import { wordApiService } from "../../words/services/wordApiService";
import { wordValidator } from "../../words/validators/wordValidator";
import type { Word, CreateWordRequest } from "../../words/types/word";
import type { AddWordFormData, AddWordErrors } from "../types/addWordRequest";

export const addWordService = {
  /**
   * Valide les données du formulaire d'ajout de mot
   */
  validateWordData(formData: AddWordFormData): AddWordErrors | null {
    return wordValidator.validateWordFields(
      formData.frenchWord,
      formData.englishWord
    ) as AddWordErrors | null;
  },

  /**
   * Crée un nouveau mot
   */
  async createWord(userId: string, wordData: AddWordFormData): Promise<Word> {
    try {
      const createWordRequest: CreateWordRequest = {
        userId,
        frenchWord: wordData.frenchWord.trim(),
        englishWord: wordData.englishWord.trim(),
      };

      return await wordApiService.create(createWordRequest);
    } catch (error) {
      console.error("Erreur lors de la création du mot:", error);
      throw error;
    }
  },

  /**
   * Vérifie si un mot existe déjà pour l'utilisateur
   */
  async checkDuplicateWord(
    userId: string,
    frenchWord: string,
    englishWord: string
  ): Promise<boolean> {
    try {
      const userWords = await wordApiService.getByUserId(userId);
      return userWords.some(
        (word) =>
          word.frenchWord.toLowerCase() === frenchWord.toLowerCase() ||
          word.englishWord.toLowerCase() === englishWord.toLowerCase()
      );
    } catch (error) {
      console.warn("Impossible de vérifier les doublons:", error);
      return false; // En cas d'erreur, on laisse l'utilisateur continuer
    }
  },
};
