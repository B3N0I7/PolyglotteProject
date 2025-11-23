/**
 * Entité principale Word - Représentation d'un mot dans le système
 */
export interface Word {
  id: string;
  userId: string;
  frenchWord: string;
  englishWord: string;
  createdAt: string;
}

/**
 * Requête pour créer un nouveau mot
 */
export interface CreateWordRequest {
  userId: string;
  frenchWord: string;
  englishWord: string;
}

/**
 * Requête pour mettre à jour un mot existant
 * Les champs sont optionnels pour permettre des mises à jour partielles
 */
export interface UpdateWordRequest {
  frenchWord?: string;
  englishWord?: string;
}

/**
 * Requête pour supprimer un mot
 */
export interface DeleteWordRequest {
  id: string;
}
