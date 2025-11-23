/**
 * Erreurs de validation pour les champs d'un mot
 */
export interface WordValidationErrors {
  frenchWord?: string;
  englishWord?: string;
}

/**
 * Erreurs générales liées aux opérations sur les mots
 */
export interface WordOperationError {
  message: string;
  code?: string;
}
