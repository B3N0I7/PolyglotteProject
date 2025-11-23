import { wordApiService } from "../../words/services/wordApiService";

export const deleteWordService = {
  /**
   * Supprime un mot existant
   */
  async deleteWord(wordId: string): Promise<void> {
    try {
      return await wordApiService.delete(wordId);
    } catch (error) {
      console.error("Erreur lors de la suppression du mot:", error);
      throw error;
    }
  },
};
