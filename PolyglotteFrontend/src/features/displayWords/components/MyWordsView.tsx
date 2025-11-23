import React from "react";
import type { Word } from "../types/word";
import { WordsTable } from "./WordsTable";
import { ConfirmModal } from "../../../shared/components/ConfirmModal/ConfirmModal";
import "./MyWordsView.css";

interface MyWordsViewProps {
  words: Word[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  isAuthenticated: boolean;
  hasWords: boolean;
  isEmpty: boolean;
  showDeleteModal: boolean;
  wordToDelete: string | null;
  onEdit: (word: Word) => void;
  onDelete: (wordId: string) => void;
  onAdd: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

export const MyWordsView: React.FC<MyWordsViewProps> = ({
  words,
  loading,
  error,
  successMessage,
  isAuthenticated,
  hasWords,
  isEmpty,
  showDeleteModal,
  //wordToDelete,
  onEdit,
  onDelete,
  onAdd,
  onConfirmDelete,
  onCancelDelete,
}) => {
  if (!isAuthenticated) {
    return (
      <div className="welcome-section">
        <div className="auth-prompt">
          <h2>Connexion requise</h2>
          <p>
            Veuillez vous connecter pour accéder à votre dictionnaire
            personnalisé.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="welcome-section">
      {!isEmpty && (
        <div className="header-actions">
          <button className="btn btn-primary" onClick={onAdd}>
            Ajouter un mot
          </button>
        </div>
      )}

      {successMessage && (
        <div className="success-banner">
          <p>{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <p>Erreur: {error}</p>
        </div>
      )}

      {isEmpty && (
        <div className="empty-state">
          <h3>Aucun mot dans votre dictionnaire</h3>
          <p>
            Commencez à construire votre dictionnaire en ajoutant votre premier
            mot !
          </p>
          <button className="btn btn-primary" onClick={onAdd}>
            Ajouter mon premier mot
          </button>
        </div>
      )}

      {hasWords && (
        <WordsTable
          words={words}
          loading={loading}
          error={error}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Supprimer le mot"
        message="Êtes-vous sûr de vouloir supprimer ce mot ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
        isLoading={loading}
      />
    </div>
  );
};
