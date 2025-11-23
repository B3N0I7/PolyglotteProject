/**
 * Types UI spécifiques à la suppression de mot
 * Les types de domaine (DeleteWordRequest) sont dans features/words/types
 */

export interface DeleteWordErrors {
  general?: string;
}

export interface DeleteWordConfirmProps {
  wordId: string;
  frenchWord: string;
  englishWord: string;
  isLoading: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}
