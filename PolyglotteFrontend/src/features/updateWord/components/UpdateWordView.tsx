import React from "react";
import { UpdateWordForm } from "./UpdateWordForm";
import type {
  UpdateWordFormData,
  UpdateWordErrors,
} from "../types/updateWordRequest";
import "../../addWord/components/AddWordView.css";

interface UpdateWordViewProps {
  formData: UpdateWordFormData;
  errors: UpdateWordErrors;
  isLoading: boolean;
  isAuthenticated: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

export const UpdateWordView: React.FC<UpdateWordViewProps> = ({
  formData,
  errors,
  isLoading,
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
            Veuillez vous connecter pour modifier des mots de votre vocabulaire.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="welcome-section">
      <div className="page-header">
        <div className="header-content"></div>
      </div>

      <div className="add-word-container">
        <div className="form-card">
          <div className="card-header">
            <h2>Modifier le Mot</h2>
            <p>Modifiez les informations ci-dessous</p>
          </div>

          <div className="card-body">
            <UpdateWordForm
              formData={formData}
              errors={errors}
              isLoading={isLoading}
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
