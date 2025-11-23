import React from "react";
import type { DeleteWordErrors } from "../types/deleteWordRequest";
import type { Word } from "../../words/types/word";

interface DeleteWordConfirmProps {
  wordToDelete: Word | undefined;
  errors: DeleteWordErrors;
  isLoading: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export const DeleteWordConfirm: React.FC<DeleteWordConfirmProps> = ({
  wordToDelete,
  errors,
  isLoading,
  onConfirm,
  onCancel,
}) => {
  if (!wordToDelete) {
    return (
      <div className="add-word-form">
        <div className="error-banner">
          <p>Mot non trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-word-form">
      {errors.general && (
        <div className="error-banner">
          <p>{errors.general}</p>
        </div>
      )}

      <div className="confirm-message">
        <h3>Êtes-vous sûr de vouloir supprimer ce mot ?</h3>
        <div className="word-details">
          <p>
            <strong>Français :</strong> {wordToDelete.frenchWord}
          </p>
          <p>
            <strong>Anglais :</strong> {wordToDelete.englishWord}
          </p>
        </div>
        <p>Cette action est irréversible.</p>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Annuler
        </button>

        <button
          type="button"
          className="btn btn-danger"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Suppression en cours..." : "Supprimer"}
        </button>
      </div>
    </div>
  );
};
