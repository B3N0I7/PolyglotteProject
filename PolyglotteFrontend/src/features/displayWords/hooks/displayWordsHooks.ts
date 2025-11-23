import { useState, useEffect } from "react";
import { wordService } from "../services/wordService";
import { useAuth } from "../../../app/providers/AuthContext";
import type { Word } from "../types/word";

export const useUserWords = () => {
  const { user } = useAuth();
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserWords = async () => {
    if (!user) {
      setWords([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userWords = await wordService.getWordsByUserId(user.id);
      setWords(userWords);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des mots"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserWords();
  }, [user]);

  const addWord = async (frenchWord: string, englishWord: string) => {
    if (!user) throw new Error("Utilisateur non connecté");

    try {
      const newWord = await wordService.createWord({
        userId: user.id,
        frenchWord,
        englishWord,
      });
      setWords((prev) => [...prev, newWord]);
      return newWord;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de l'ajout du mot";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateWord = async (
    id: string,
    userId?: string,
    frenchWord?: string,
    englishWord?: string
  ) => {
    try {
      const updatedWord = await wordService.updateWord(id, userId, {
        frenchWord,
        englishWord,
      });
      setWords((prev) =>
        prev.map((word) => (word.id === id ? updatedWord : word))
      );
      return updatedWord;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de la mise à jour du mot";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteWord = async (id: string) => {
    try {
      await wordService.deleteWord(id);
      setWords((prev) => prev.filter((word) => word.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression du mot";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    words,
    loading,
    error,
    addWord,
    updateWord,
    deleteWord,
    refetch: fetchUserWords,
  };
};
