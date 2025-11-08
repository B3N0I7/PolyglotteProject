import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { id: 'accueil', label: 'Accueil', icon: '🏠', path: '/' },
        { id: 'apprendre', label: 'Apprendre', icon: '📚', path: '/apprendre' },
        { id: 'mots', label: 'Mes Mots', icon: '📝', path: '/mots' },
        { id: 'progression', label: 'Progression', icon: '📈', path: '/progression' },
        { id: 'communaute', label: 'Communauté', icon: '👥', path: '/communaute' },
    ];

    const getActiveItem = () => {
        const currentItem = menuItems.find(item => item.path === location.pathname);
        return currentItem ? currentItem.id : 'accueil';
    };

    const handleItemClick = (item: typeof menuItems[0]) => {
        navigate(item.path);
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <ul className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    {menuItems.map((item) => (
                        <li key={item.id} className="navbar-item">
                            <button
                                className={`navbar-link ${getActiveItem() === item.id ? 'active' : ''}`}
                                onClick={() => handleItemClick(item)}
                            >
                                <span className="navbar-icon">{item.icon}</span>
                                <span className="navbar-label">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;