import { ApiError } from "../services/apiClient";

export const handleApiError = (
  error: unknown,
  defaultMessage: string
): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return "Données invalides. Veuillez vérifier vos informations.";
      case 401:
        return "Authentification requise. Veuillez vous connecter.";
      case 403:
        return "Accès interdit. Vous n'avez pas les permissions nécessaires.";
      case 404:
        return "Ressource non trouvée.";
      case 409:
        return "Conflit - Cette ressource existe déjà.";
      case 429:
        return "Trop de tentatives. Veuillez patienter quelques minutes.";
      case 500:
        return "Erreur serveur. Veuillez réessayer plus tard.";
      default:
        return error.message || defaultMessage;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (
  password: string
): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Le mot de passe doit contenir au moins 8 caractères",
    };
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return {
      isValid: false,
      message: "Le mot de passe doit contenir au moins une minuscule",
    };
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return {
      isValid: false,
      message: "Le mot de passe doit contenir au moins une majuscule",
    };
  }

  if (!/(?=.*\d)/.test(password)) {
    return {
      isValid: false,
      message: "Le mot de passe doit contenir au moins un chiffre",
    };
  }

  return { isValid: true };
};

export const validateName = (
  name: string,
  fieldName: string
): { isValid: boolean; message?: string } => {
  if (!name.trim()) {
    return {
      isValid: false,
      message: `Le ${fieldName.toLowerCase()} est requis`,
    };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      message: `Le ${fieldName.toLowerCase()} doit contenir au moins 2 caractères`,
    };
  }

  if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(name)) {
    return {
      isValid: false,
      message: `Le ${fieldName.toLowerCase()} ne peut contenir que des lettres`,
    };
  }

  return { isValid: true };
};
