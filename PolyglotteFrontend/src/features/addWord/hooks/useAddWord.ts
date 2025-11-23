import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthContext";
import { addWordService } from "../services/addWordService";
import type { AddWordFormData, AddWordErrors } from "../types/addWordRequest";
import { handleApiError } from "../../../shared/helpers/validation";

export const useAddWord = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<AddWordFormData>({
    frenchWord: "",
    englishWord: "",
  });

  const [errors, setErrors] = useState<AddWordErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDuplicateChecking, setIsDuplicateChecking] = useState(false);

  // Redirection si pas authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: { pathname: "/words/add" } },
      });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when user starts typing
      if (errors[name as keyof AddWordErrors]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors]
  );

  const checkForDuplicates = useCallback(async () => {
    if (!user || !formData.frenchWord.trim() || !formData.englishWord.trim()) {
      return;
    }

    setIsDuplicateChecking(true);
    try {
      const isDuplicate = await addWordService.checkDuplicateWord(
        user.id,
        formData.frenchWord,
        formData.englishWord
      );

      if (isDuplicate) {
        setErrors((prev) => ({
          ...prev,
          general: "Ce mot existe déjà dans votre dictionnaire.",
        }));
      }
    } catch (error) {
      console.warn("Erreur lors de la vérification des doublons:", error);
    } finally {
      setIsDuplicateChecking(false);
    }
  }, [user, formData.frenchWord, formData.englishWord]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!user) {
        setErrors({ general: "Vous devez être connecté pour ajouter un mot." });
        return;
      }

      // Validation côté client
      const validationErrors = addWordService.validateWordData(formData);
      if (validationErrors) {
        setErrors(validationErrors);
        return;
      }

      setIsLoading(true);
      setErrors({});

      try {
        // Vérification des doublons
        const isDuplicate = await addWordService.checkDuplicateWord(
          user.id,
          formData.frenchWord,
          formData.englishWord
        );

        if (isDuplicate) {
          setErrors({
            general: "Ce mot existe déjà dans votre dictionnaire.",
          });
          return;
        }

        // Création du mot
        await addWordService.createWord(user.id, formData);

        // Redirection vers la liste des mots avec message de succès
        navigate("/words", {
          state: {
            message: `Mot "${formData.frenchWord}" ajouté avec succès !`,
          },
        });
      } catch (error) {
        console.error("Erreur lors de l'ajout du mot:", error);
        setErrors({
          general: handleApiError(
            error,
            "Erreur lors de l'ajout du mot. Veuillez réessayer."
          ),
        });
      } finally {
        setIsLoading(false);
      }
    },
    [user, formData, navigate]
  );

  const handleCancel = useCallback(() => {
    navigate("/words");
  }, [navigate]);

  // Vérification automatique des doublons quand les mots changent
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkForDuplicates();
    }, 1000); // Debounce de 1 seconde

    return () => clearTimeout(timeoutId);
  }, [checkForDuplicates]);

  return {
    // État des données
    formData,
    errors,
    isLoading,
    isDuplicateChecking,
    isAuthenticated,

    // Actions
    onChange: handleChange,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
  };
};
