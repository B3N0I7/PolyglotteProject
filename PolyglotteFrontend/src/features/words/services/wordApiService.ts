import { apiClient, ApiError } from "../../../shared/services/apiClient";
import type { Word, CreateWordRequest, UpdateWordRequest } from "../types/word";

/**
 * Service API pur pour les opérations CRUD sur les mots
 * Ne contient aucune logique métier, uniquement des appels HTTP
 */
export const wordApiService = {
  /**
   * Récupère tous les mots
   * @returns Promise<Word[]>
   * @throws Error en cas d'échec de la requête
   */
  async getAll(): Promise<Word[]> {
    try {
      return await apiClient.get<Word[]>("/words");
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des mots : ${error}`);
    }
  },

  /**
   * Récupère un mot par son ID
   * @param id - L'identifiant du mot
   * @returns Promise<Word>
   * @throws Error si le mot n'existe pas ou en cas d'échec
   */
  async getById(id: string): Promise<Word> {
    try {
      return await apiClient.get<Word>(`/words/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        throw new Error("Mot non trouvé");
      }
      throw new Error("Erreur lors de la récupération du mot");
    }
  },

  /**
   * Récupère tous les mots d'un utilisateur
   * @param userId - L'identifiant de l'utilisateur
   * @returns Promise<Word[]>
   * @throws Error en cas d'échec de la requête
   */
  async getByUserId(userId: string): Promise<Word[]> {
    try {
      const allWords = await apiClient.get<Word[]>("/words");
      return allWords.filter((word) => word.userId === userId);
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des mots de l'utilisateur : ${error}`
      );
    }
  },

  /**
   * Crée un nouveau mot
   * @param wordData - Les données du mot à créer
   * @returns Promise<Word>
   * @throws Error en cas de données invalides ou d'échec
   */
  async create(wordData: CreateWordRequest): Promise<Word> {
    try {
      return await apiClient.post<Word>("/words", wordData);
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        throw new Error("Données du mot invalides");
      }
      throw new Error("Erreur lors de la création du mot");
    }
  },

  /**
   * Met à jour un mot existant
   * @param id - L'identifiant du mot
   * @param userId - L'identifiant de l'utilisateur propriétaire
   * @param data - Les données à mettre à jour
   * @returns Promise<Word>
   * @throws Error en cas d'échec de la mise à jour
   */
  async update(
    id: string,
    userId: string,
    data: UpdateWordRequest
  ): Promise<Word> {
    try {
      const body: Record<string, unknown> = { ...data, userId };

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "https://localhost:7081/api"}/words/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Si la réponse est vide (204 No Content), retourner l'objet mis à jour
      if (response.status === 204) {
        return {
          id,
          userId,
          frenchWord: data.frenchWord || "",
          englishWord: data.englishWord || "",
          createdAt: "",
        } as Word;
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du mot: ${error}`);
    }
  },

  /**
   * Supprime un mot
   * @param id - L'identifiant du mot à supprimer
   * @returns Promise<void>
   * @throws Error si le mot n'existe pas ou en cas d'échec
   */
  async delete(id: string): Promise<void> {
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
