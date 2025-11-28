import React from "react";
import { Link } from "react-router-dom";
import type { LoginFormData, LoginErrors } from "../types/loginRequest";

interface LoginFormProps {
  formData: LoginFormData;
  errors: LoginErrors;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  errors,
  isLoading,
  onSubmit,
  onChange,
}) => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Connexion</h1>
          <p>Connectez-vous à votre compte Polyglotte</p>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message general-error">{errors.general}</div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              className={errors.email ? "error" : ""}
              placeholder="votre@email.com"
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
              autoComplete="current-password"
              disabled={isLoading}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe || false}
                onChange={onChange}
                disabled={isLoading}
              />
              <span className="checkmark"></span>
              Se souvenir de moi
            </label>
            <a href="#" className="forgot-password">
              Mot de passe oublié?
            </a>
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={isLoading}
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Pas encore de compte ?
            <Link to="/register" className="auth-link">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
