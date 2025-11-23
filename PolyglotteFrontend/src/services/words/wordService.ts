import { apiClient, ApiError } from "../../shared/services/apiClient";
import type { Word, CreateWordRequest } from "../../features/words/types/word";

export const wordService = {
  async getAllWords(): Promise<Word[]> {
    try {
      return await apiClient.get<Word[]>("/words");
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des mots : ${error}`);
    }
  },

  async getWordById(id: string): Promise<Word> {
    try {
      return await apiClient.get<Word>(`/words/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        throw new Error("Mot non trouvé");
      }
      throw new Error("Erreur lors de la récupération du mot");
    }
  },

  async getWordsByUserId(userId: string): Promise<Word[]> {
    try {
      const allWords = await apiClient.get<Word[]>("/words");
      return allWords.filter((word) => word.userId === userId);
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des mots de l'utilisateur : ${error}`
      );
    }
  },

  async createWord(wordData: CreateWordRequest): Promise<Word> {
    try {
      return await apiClient.post<Word>("/words", wordData);
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        throw new Error("Données du mot invalides");
      }
      throw new Error("Erreur lors de la création du mot");
    }
  },

  async updateWord(
    id: string,
    userId: string | undefined,
    update: { frenchWord?: string; englishWord?: string }
  ): Promise<Word> {
    try {
      const body: Record<string, unknown> = { ...update };
      if (userId) body.userId = userId;
      return await apiClient.put<Word>(`/words/${id}`, body);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        throw new Error("Mot non trouvé");
      } else if (error instanceof ApiError && error.status === 400) {
        throw new Error("Données de mise à jour invalides");
      }
      throw new Error("Erreur lors de la mise à jour du mot");
    }
  },

  async deleteWord(id: string): Promise<void> {
    try {
      return await apiClient.delete(`/words/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        throw new Error("Mot non trouvé");
      }
      throw new Error("Erreur lors de la suppression du mot");
    }
  },
};
