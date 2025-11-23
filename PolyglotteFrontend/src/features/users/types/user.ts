/**
 * Entité principale User - Représentation d'un utilisateur dans le système
 */
export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // ⚠️ À ne pas exposer en production côté client
  createdAt: string;
}

/**
 * Requête pour créer un nouveau utilisateur
 */
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

/**
 * Requête pour mettre à jour un utilisateur existant
 * Les champs sont optionnels pour permettre des mises à jour partielles
 */
export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
}

/**
 * Requête pour supprimer un utilisateur
 */
export interface DeleteUserRequest {
  id: string;
}

/**
 * Réponse de l'API backend lors de la création/récupération d'un utilisateur
 * Supporte les variations de nommage entre backend et frontend
 */
export interface UserApiResponse {
  id: string;
  username?: string;
  username?: string; // Support des deux formats backend
  email: string;
  password: string;
  createdAt: string;
}
