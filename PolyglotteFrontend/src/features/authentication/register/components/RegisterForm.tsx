import React from "react";
import { Link } from "react-router-dom";
import type {
  RegisterFormData,
  RegisterErrors,
} from "../types/registerRequest";

interface RegisterFormProps {
  formData: RegisterFormData;
  errors: RegisterErrors;
  isLoading: boolean;
  passwordStrength: {
    score: number;
    message: string;
    color: string;
  };
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  formData,
  errors,
  isLoading,
  passwordStrength,
  onSubmit,
  onChange,
}) => {
  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h1>Créer un compte</h1>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message general-error">{errors.general}</div>
          )}

          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={onChange}
                className={errors.username ? "error" : ""}
                placeholder="Jean"
                autoComplete="given-name"
                disabled={isLoading}
              />
              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              className={errors.email ? "error" : ""}
              placeholder="jean.dupont@email.com"
              autoComplete="email"
              disabled={isLoading}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              className={errors.password ? "error" : ""}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isLoading}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
            <div className="password-info">
              <small className="password-hint">
                Au moins 8 caractères avec une majuscule, une minuscule et un
                chiffre
              </small>
              {formData.password && (
                <div className="password-strength">
                  <span
                    className="strength-indicator"
                    style={{ color: passwordStrength.color }}
                  >
                    Force: {passwordStrength.message}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={onChange}
              className={errors.confirmPassword ? "error" : ""}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={onChange}
                disabled={isLoading}
              />
              <span className="checkmark"></span>
              J'accepte les{" "}
              <a href="#" className="terms-link">
                conditions d'utilisation
              </a>{" "}
              et la{" "}
              <a href="#" className="terms-link">
                politique de confidentialité
              </a>
            </label>
            {errors.acceptTerms && (
              <span className="error-message">{errors.acceptTerms}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={isLoading}
          >
            {isLoading ? "Création du compte..." : "Créer mon compte"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Déjà un compte?
            <Link to="/login" className="auth-link">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
