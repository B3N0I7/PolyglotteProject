import React from "react";
import type { AddWordFormData, AddWordErrors } from "../types/addWordRequest";

interface AddWordFormProps {
  formData: AddWordFormData;
  errors: AddWordErrors;
  isLoading: boolean;
  isDuplicateChecking: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

export const AddWordForm: React.FC<AddWordFormProps> = ({
  formData,
  errors,
  isLoading,
  isDuplicateChecking,
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

      {isDuplicateChecking && (
        <div className="checking-duplicates">
          <span className="loading-text">🔍 Vérification des doublons...</span>
        </div>
      )}

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
            isDuplicateChecking ||
            !formData.frenchWord.trim() ||
            !formData.englishWord.trim()
          }
        >
          {isLoading ? "Ajout en cours..." : "Ajouter le mot"}
        </button>
      </div>
    </form>
  );
};
