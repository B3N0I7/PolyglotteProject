import React from "react";
import type {
  UpdateWordFormData,
  UpdateWordErrors,
} from "../types/updateWordRequest";

interface UpdateWordFormProps {
  formData: UpdateWordFormData;
  errors: UpdateWordErrors;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

export const UpdateWordForm: React.FC<UpdateWordFormProps> = ({
  formData,
  errors,
  isLoading,
  onSubmit,
  onChange,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className="add-word-form">
      {errors.general && (
        <div className="error-banner">
          <p>{errors.general}</p>
        </div>
      )}

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="frenchWord" className="form-label required">
            Mot en français
          </label>
          <input
            type="text"
            id="frenchWord"
            name="frenchWord"
            value={formData.frenchWord}
            onChange={onChange}
            className={`form-input ${errors.frenchWord ? "error" : ""}`}
            placeholder="Entrez le mot en français"
            autoComplete="off"
            disabled={isLoading}
            maxLength={100}
            required
          />
          {errors.frenchWord && (
            <span className="error-message">{errors.frenchWord}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="englishWord" className="form-label required">
            Mot en anglais
          </label>
          <input
            type="text"
            id="englishWord"
            name="englishWord"
            value={formData.englishWord}
            onChange={onChange}
            className={`form-input ${errors.englishWord ? "error" : ""}`}
            placeholder="Entrez le mot en anglais"
            autoComplete="off"
            disabled={isLoading}
            maxLength={100}
            required
          />
          {errors.englishWord && (
            <span className="error-message">{errors.englishWord}</span>
          )}
        </div>
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
          type="submit"
          className="btn btn-primary"
          disabled={
            isLoading ||
            !formData.frenchWord.trim() ||
            !formData.englishWord.trim()
          }
        >
          {isLoading ? "Modification en cours..." : "Modifier le mot"}
        </button>
      </div>
    </form>
  );
};
