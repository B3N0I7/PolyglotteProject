import { useState, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthContext";
import { deleteWordService } from "../services/deleteWordService";
import type { DeleteWordErrors } from "../types/deleteWordRequest";
import type { Word } from "../../words/types/word";
import { handleApiError } from "../../../shared/helpers/validation";

export const useDeleteWord = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const wordToDelete = location.state?.word as Word;

  const [errors, setErrors] = useState<DeleteWordErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = useCallback(async () => {
    if (!user || !id) {
      setErrors({ general: "Vous devez être connecté pour supprimer un mot." });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await deleteWordService.deleteWord(id);

      navigate("/words", {
        state: {
          message: `Mot "${wordToDelete?.frenchWord}" supprimé avec succès !`,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du mot:", error);
      setErrors({
        general: handleApiError(
          error,
          "Erreur lors de la suppression du mot. Veuillez réessayer."
        ),
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, id, wordToDelete, navigate]);

  const handleCancel = useCallback(() => {
    navigate("/words");
  }, [navigate]);

  return {
    wordToDelete,
    errors,
    isLoading,
    isAuthenticated,

    onConfirm: handleConfirm,
    onCancel: handleCancel,
  };
};
