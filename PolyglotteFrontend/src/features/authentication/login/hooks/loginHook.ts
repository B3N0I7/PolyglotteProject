import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../../app/providers/AuthContext";
import { loginService } from "../services/loginService";
import type { LoginFormData, LoginErrors } from "../types/loginRequest";
import { handleApiError } from "../../../../shared/helpers/validation";

export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Récupérer la page d'origine depuis la navigation
  const from = location.state?.from?.pathname || "/";

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof LoginErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation côté client
    const validationErrors = loginService.validateCredentials({
      email: formData.email,
      password: formData.password,
    });

    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Authentification
      await login(formData.email, formData.password);

      // Gestion du "Se souvenir de moi"
      if (formData.rememberMe !== undefined) {
        loginService.handleRememberMe(formData.rememberMe);
      }

      // Redirection vers la page d'origine ou accueil
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      setErrors({
        general: handleApiError(
          error,
          "Erreur lors de la connexion. Veuillez réessayer."
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
  };
};
