import React from 'react';
import './Header.css';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="header-container">
                <div className="header-brand">
                    <h1 className="header-title">Polyglotte</h1>
                    <span className="header-subtitle">Maîtrisez les langues du monde</span>
                </div>
                <div className="header-actions">
                    <button className="header-btn primary">Connexion</button>
                    <button className="header-btn secondary">S'inscrire</button>
                </div>
            </div>
        </header>
    );
};

export default Header;