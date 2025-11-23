import React from "react";
import { DeleteWordConfirm } from "./DeleteWordConfirm";
import type { DeleteWordErrors } from "../types/deleteWordRequest";
import type { Word } from "../../words/types/word";
import "../../addWord/components/AddWordView.css";

interface DeleteWordViewProps {
  wordToDelete: Word | undefined;
  errors: DeleteWordErrors;
  isLoading: boolean;
  isAuthenticated: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export const DeleteWordView: React.FC<DeleteWordViewProps> = ({
  wordToDelete,
  errors,
  isLoading,
  isAuthenticated,
  onConfirm,
  onCancel,
}) => {
  if (!isAuthenticated) {
    return (
      <div className="welcome-section">
        <div className="auth-prompt">
          <h2>Connexion requise</h2>
          <p>
            Veuillez vous connecter pour supprimer des mots de votre
            vocabulaire.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="welcome-section">
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Supprimer un Mot</h1>
            <p>
              Confirmez la suppression de ce mot de votre vocabulaire personnel.
            </p>
          </div>
        </div>
      </div>

      <div className="add-word-container">
        <div className="form-card">
          <div className="card-header">
            <h2>Confirmer la Suppression</h2>
            <p>Cette action ne peut pas être annulée</p>
          </div>

          <div className="card-body">
            <DeleteWordConfirm
              wordToDelete={wordToDelete}
              errors={errors}
              isLoading={isLoading}
              onConfirm={onConfirm}
              onCancel={onCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
