/**
 * Types UI spécifiques au formulaire d'ajout de mot
 * Les types de domaine (Word, CreateWordRequest) sont dans features/words/types
 */

export interface AddWordFormData {
  frenchWord: string;
  englishWord: string;
}

export interface AddWordErrors {
  frenchWord?: string;
  englishWord?: string;
  general?: string;
}

export interface AddWordFormProps {
  formData: AddWordFormData;
  errors: AddWordErrors;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}
