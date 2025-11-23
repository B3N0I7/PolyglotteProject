import { wordApiService } from "../../words/services/wordApiService";
import { wordValidator } from "../../words/validators/wordValidator";
import type { Word, UpdateWordRequest } from "../../words/types/word";
import type {
  UpdateWordFormData,
  UpdateWordErrors,
} from "../types/updateWordRequest";

export const updateWordService = {
  /**
   * Valide les données du formulaire de modification de mot
   */
  validateWordData(formData: UpdateWordFormData): UpdateWordErrors | null {
    return wordValidator.validateWordFields(
      formData.frenchWord,
      formData.englishWord
    ) as UpdateWordErrors | null;
  },

  /**
   * Modifie un mot existant
   */
  async updateWord(
    wordId: string,
    userId: string,
    wordData: UpdateWordFormData
  ): Promise<Word> {
    try {
      const updateWordRequest: UpdateWordRequest = {
        frenchWord: wordData.frenchWord.trim(),
        englishWord: wordData.englishWord.trim(),
      };

      return await wordApiService.update(wordId, userId, updateWordRequest);
    } catch (error) {
      console.error("Erreur lors de la modification du mot:", error);
      throw error;
    }
  },
};
