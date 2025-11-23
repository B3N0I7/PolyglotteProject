import { wordApiService } from "../../words/services/wordApiService";
import type { Word } from "../../words/types/word";

/**
 * Service spécifique à l'affichage des mots
 * Délègue les opérations CRUD au wordApiService centralisé
 * Peut contenir de la logique métier spécifique à l'affichage (filtres, tri, etc.)
 */
export const wordService = {
  /**
   * @deprecated Utiliser wordApiService.getAll() directement
   */
  async getAllWords(): Promise<Word[]> {
    return await wordApiService.getAll();
  },

  /**
   * @deprecated Utiliser wordApiService.getById() directement
   */
  async getWordById(id: string): Promise<Word> {
    return await wordApiService.getById(id);
  },

  /**
   * @deprecated Utiliser wordApiService.getByUserId() directement
   */
  async getWordsByUserId(userId: string): Promise<Word[]> {
    return await wordApiService.getByUserId(userId);
  },

  /**
   * @deprecated Utiliser wordApiService.create() directement
   */
  async createWord(wordData: {
    userId: string;
    frenchWord: string;
    englishWord: string;
  }): Promise<Word> {
    return await wordApiService.create(wordData);
  },

  /**
   * @deprecated Utiliser wordApiService.update() directement
   */
  async updateWord(
    id: string,
    userId: string | undefined,
    update: { frenchWord?: string; englishWord?: string }
  ): Promise<Word> {
    return await wordApiService.update(id, userId || "", update);
  },

  /**
   * @deprecated Utiliser wordApiService.delete() directement
   */
  async deleteWord(id: string): Promise<void> {
    return await wordApiService.delete(id);
  },
};
