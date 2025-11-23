import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthContext";
import { useUserWords } from "./displayWordsHooks";
import type { Word } from "../types/word";
import { handleApiError } from "../../../shared/helpers/validation";

export const useMyWords = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { words, loading, error, deleteWord, refetch } = useUserWords();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [wordToDelete, setWordToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setTimeout(() => setSuccessMessage(null), 5000);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleEditWord = useCallback(
    (word: Word) => {
      // Navigation vers la page d'édition avec l'ID du mot
      navigate(`/words/edit/${word.id}`, {
        state: { word },
      });
    },
    [navigate]
  );

  const handleDeleteWord = useCallback(async (wordId: string) => {
    setWordToDelete(wordId);
    setShowDeleteModal(true);
  }, []);

  const confirmDeleteWord = useCallback(async () => {
    if (!wordToDelete) return;

    try {
      await deleteWord(wordToDelete);
      setShowDeleteModal(false);
      setWordToDelete(null);
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Erreur lors de la suppression du mot"
      );
      alert(errorMessage);
      refetch();
    }
  }, [wordToDelete, deleteWord, refetch]);

  const cancelDeleteWord = useCallback(() => {
    setShowDeleteModal(false);
    setWordToDelete(null);
  }, []);

  const handleAddWord = useCallback(() => {
    // Navigation vers la page d'ajout de mot
    navigate("/words/add");
  }, [navigate]);

  // Données dérivées pour l'affichage
  const hasWords = words.length > 0;
  const isEmpty = !loading && !error && words.length === 0;

  return {
    // État des données
    words,
    loading,
    error,
    successMessage,
    isAuthenticated,

    // État dérivé
    hasWords,
    isEmpty,

    // Modal de suppression
    showDeleteModal,
    wordToDelete,

    // Actions
    onEdit: handleEditWord,
    onDelete: handleDeleteWord,
    onAdd: handleAddWord,
    onConfirmDelete: confirmDeleteWord,
    onCancelDelete: cancelDeleteWord,
  };
};
