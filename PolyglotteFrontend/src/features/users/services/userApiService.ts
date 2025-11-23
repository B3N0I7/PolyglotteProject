import { apiClient, ApiError } from "../../../shared/services/apiClient";
import type { User, CreateUserRequest, UpdateUserRequest } from "../types/user";

/**
 * Service API pur pour les opérations CRUD sur les utilisateurs
 * Ne contient aucune logique métier, uniquement des appels HTTP
 */
export const userApiService = {
  /**
   * Récupère tous les utilisateurs
   * @returns Promise<User[]>
   * @throws Error en cas d'échec de la requête
   */
  async getAll(): Promise<User[]> {
    try {
      return await apiClient.get<User[]>("/users");
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des utilisateurs: ${error}`
      );
    }
  },

  /**
   * Récupère un utilisateur par son ID
   * @param id - L'identifiant de l'utilisateur
   * @returns Promise<User>
   * @throws Error si l'utilisateur n'existe pas ou en cas d'échec
   */
  async getById(id: string): Promise<User> {
    try {
      return await apiClient.get<User>(`/users/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        throw new Error("Utilisateur non trouvé");
      }
      throw new Error("Erreur lors de la récupération de l'utilisateur");
    }
  },

  /**
   * Récupère un utilisateur par son email
   * @param email - L'email de l'utilisateur
   * @returns Promise<User | null>
   * @throws Error en cas d'échec de la requête
   */
  async getByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getAll();
      return users.find((u) => u.email === email) || null;
    } catch (error) {
      throw new Error(`Erreur lors de la recherche par email: ${error}`);
    }
  },

  /**
   * Crée un nouveau utilisateur
   * @param userData - Les données de l'utilisateur à créer
   * @returns Promise<User>
   * @throws Error en cas de données invalides ou d'échec
   */
  async create(userData: CreateUserRequest): Promise<User> {
    try {
      return await apiClient.post<User>("/users", userData);
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        throw new Error("Données utilisateur invalides");
      } else if (error instanceof ApiError && error.status === 500) {
        throw new Error("Nom d'utilisateur ou email déjà existant");
      }
      throw new Error("Erreur lors de la création de l'utilisateur");
    }
  },

  /**
   * Met à jour un utilisateur existant
   * @param id - L'identifiant de l'utilisateur
   * @param userData - Les données à mettre à jour
   * @returns Promise<User>
   * @throws Error en cas d'échec de la mise à jour
   */
  async update(id: string, userData: UpdateUserRequest): Promise<User> {
    try {
      return await apiClient.put<User>(`/users/${id}`, userData);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        throw new Error("Utilisateur non trouvé");
      } else if (error instanceof ApiError && error.status === 400) {
        throw new Error("Données de mise à jour invalides");
      }
      throw new Error("Erreur lors de la mise à jour de l'utilisateur");
    }
  },

  /**
   * Supprime un utilisateur
   * @param id - L'identifiant de l'utilisateur à supprimer
   * @returns Promise<void>
   * @throws Error si l'utilisateur n'existe pas ou en cas d'échec
   */
  async delete(id: string): Promise<void> {
    try {
      return await apiClient.delete(`/users/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        throw new Error("Utilisateur non trouvé");
      }
      throw new Error("Erreur lors de la suppression de l'utilisateur");
    }
  },
};
