export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginFormData extends LoginRequest {
  rememberMe?: boolean;
}

export interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  errors: LoginErrors;
}
