export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface RegisterErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  general?: string;
}

export interface RegisterFormProps {
  formData: RegisterFormData;
  errors: RegisterErrors;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
