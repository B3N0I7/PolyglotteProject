import React, { useState } from 'react';
import './Navbar.css';

const Navbar: React.FC = () => {
    const [activeItem, setActiveItem] = useState('accueil');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { id: 'accueil', label: 'Accueil', icon: '🏠' },
        { id: 'apprendre', label: 'Apprendre', icon: '📚' },
        { id: 'mots', label: 'Mes Mots', icon: '📝' },
        { id: 'progression', label: 'Progression', icon: '📈' },
        { id: 'communaute', label: 'Communauté', icon: '👥' },
    ];

    const handleItemClick = (itemId: string) => {
        setActiveItem(itemId);
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
                                className={`navbar-link ${activeItem === item.id ? 'active' : ''}`}
                                onClick={() => handleItemClick(item.id)}
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