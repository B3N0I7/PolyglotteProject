/**
 * Erreurs de validation pour les champs d'un utilisateur
 */
export interface UserValidationErrors {
  username?: string;
  email?: string;
}

/**
 * Erreurs générales liées aux opérations sur les utilisateurs
 */
export interface UserOperationError {
  message: string;
  code?: string;
}
