import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../app/providers/AuthContext";
import { registerService } from "../services/registerService";
import type {
  RegisterFormData,
  RegisterErrors,
} from "../types/registerRequest";
import { handleApiError } from "../../../../shared/helpers/validation";

export const useRegister = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof RegisterErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation côté client
    const validationErrors = registerService.validateRegistrationData(formData);

    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Création du compte
      await register(formData.username, formData.email, formData.password);

      // Redirection vers l'accueil
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      setErrors({
        general: handleApiError(
          error,
          "Erreur lors de l'inscription. Veuillez réessayer."
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calcul de la force du mot de passe pour l'affichage en temps réel
  const passwordStrength = registerService.getPasswordStrength(
    formData.password
  );

  return {
    formData,
    errors,
    isLoading,
    passwordStrength,
    handleChange,
    handleSubmit,
  };
};
