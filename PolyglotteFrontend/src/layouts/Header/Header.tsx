import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthContext";
import "./Header.css";

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <Link to="/" className="brand-link">
            <h1 className="header-title">Polyglotte</h1>
            <span className="header-subtitle">
              Elaborez vos propres dictionnaires
            </span>
          </Link>
        </div>
        <div className="header-actions">
          {isAuthenticated && user ? (
            <>
              <span className="user-welcome">Bonjour, {user.username}</span>
              <button className="header-btn secondary" onClick={handleLogout}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="header-btn primary">
                Connexion
              </Link>
              <Link to="/register" className="header-btn secondary">
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
