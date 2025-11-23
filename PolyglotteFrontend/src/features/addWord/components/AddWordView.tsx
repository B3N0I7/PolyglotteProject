import React from "react";
import { AddWordForm } from "./AddWordForm";
import type { AddWordFormData, AddWordErrors } from "../types/addWordRequest";
import "./AddWordView.css";

interface AddWordViewProps {
  formData: AddWordFormData;
  errors: AddWordErrors;
  isLoading: boolean;
  isDuplicateChecking: boolean;
  isAuthenticated: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

export const AddWordView: React.FC<AddWordViewProps> = ({
  formData,
  errors,
  isLoading,
  isDuplicateChecking,
  isAuthenticated,
  onSubmit,
  onChange,
  onCancel,
}) => {
  if (!isAuthenticated) {
    return (
      <div className="welcome-section">
        <div className="auth-prompt">
          <h2>Connexion requise</h2>
          <p>
            Veuillez vous connecter pour ajouter des mots à votre dictionnaire.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="welcome-section">
      <div className="page-header"></div>
      <div className="add-word-container">
        <div className="form-card">
          <div className="card-header">
            <h2>Nouveau Mot</h2>
          </div>

          <div className="card-body">
            <AddWordForm
              formData={formData}
              errors={errors}
              isLoading={isLoading}
              isDuplicateChecking={isDuplicateChecking}
              onSubmit={onSubmit}
              onChange={onChange}
              onCancel={onCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
