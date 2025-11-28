import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthContext";
import { updateWordService } from "../services/updateWordService";
import type {
  UpdateWordFormData,
  UpdateWordErrors,
} from "../types/updateWordRequest";
import type { Word } from "../../words/types/word";
import { handleApiError } from "../../../shared/helpers/validation";

export const useUpdateWord = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const wordToEdit = location.state?.word as Word;

  const [formData, setFormData] = useState<UpdateWordFormData>({
    frenchWord: wordToEdit?.frenchWord || "",
    englishWord: wordToEdit?.englishWord || "",
  });

  const [errors, setErrors] = useState<UpdateWordErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: { pathname: `/words/edit/${id}` } },
      });
    }
  }, [isAuthenticated, navigate, id]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name as keyof UpdateWordErrors]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!user || !id) {
        setErrors({
          general: "Vous devez être connecté pour modifier un mot.",
        });
        return;
      }

      // Vérification : aucune modification
      if (
        wordToEdit &&
        formData.frenchWord.trim() === wordToEdit.frenchWord.trim() &&
        formData.englishWord.trim() === wordToEdit.englishWord.trim()
      ) {
        setErrors({
          general:
            "Aucune modification détectée. Le mot n'a pas été mis à jour.",
        });
        setTimeout(() => {
          navigate("/words");
        }, 2500);
        return;
      }

      const validationErrors = updateWordService.validateWordData(formData);
      if (validationErrors) {
        setErrors(validationErrors);
        return;
      }

      setIsLoading(true);
      setErrors({});

      try {
        await updateWordService.updateWord(id, user.id, formData);

        navigate("/words", {
          state: {
            message: `Mot "${formData.frenchWord}" modifié avec succès !`,
          },
        });
      } catch (error) {
        console.error("Erreur lors de la modification du mot:", error);
        setErrors({
          general: handleApiError(
            error,
            "Erreur lors de la modification du mot. Veuillez réessayer."
          ),
        });
      } finally {
        setIsLoading(false);
      }
    },
    [user, id, formData, wordToEdit, navigate]
  );

  const handleCancel = useCallback(() => {
    navigate("/words");
  }, [navigate]);

  return {
    formData,
    errors,
    isLoading,
    isAuthenticated,

    onChange: handleChange,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
  };
};
