import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../app/providers';
import './Header.css';

const Header: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-brand">
                    <Link to="/" className="brand-link">
                        <h1 className="header-title">Polyglotte</h1>
                        <span className="header-subtitle">Maîtrisez les langues du monde</span>
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
                            <Link to="/connexion" className="header-btn primary">
                                Connexion
                            </Link>
                            <Link to="/inscription" className="header-btn secondary">
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