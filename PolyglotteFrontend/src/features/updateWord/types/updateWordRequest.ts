/**
 * Types UI spécifiques au formulaire de modification de mot
 * Les types de domaine (Word, UpdateWordRequest) sont dans features/words/types
 */

export interface UpdateWordFormData {
  frenchWord: string;
  englishWord: string;
}

export interface UpdateWordErrors {
  frenchWord?: string;
  englishWord?: string;
  general?: string;
}

export interface UpdateWordFormProps {
  formData: UpdateWordFormData;
  errors: UpdateWordErrors;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}
