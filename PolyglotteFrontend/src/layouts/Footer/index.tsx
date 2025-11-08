import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: 'Polyglotte',
            links: [
                { label: 'À propos', href: '#' },
                { label: 'Comment ça marche', href: '#' },
                { label: 'Blog', href: '#' },
                { label: 'Carrières', href: '#' },
            ],
        },
        {
            title: 'Apprendre',
            links: [
                { label: 'Langues disponibles', href: '#' },
                { label: 'Méthodes', href: '#' },
                { label: 'Exercices', href: '#' },
                { label: 'Tests de niveau', href: '#' },
            ],
        },
        {
            title: 'Communauté',
            links: [
                { label: 'Forum', href: '#' },
                { label: 'Événements', href: '#' },
                { label: 'Partenaires', href: '#' },
                { label: 'Ambassadeurs', href: '#' },
            ],
        },
        {
            title: 'Support',
            links: [
                { label: 'Centre d\'aide', href: '#' },
                { label: 'Contact', href: '#' },
                { label: 'FAQ', href: '#' },
                { label: 'Signaler un bug', href: '#' },
            ],
        },
    ];

    const socialLinks = [
        { name: 'Facebook', icon: '📘', href: '#' },
        { name: 'Twitter', icon: '🐦', href: '#' },
        { name: 'Instagram', icon: '📷', href: '#' },
        { name: 'LinkedIn', icon: '💼', href: '#' },
    ];

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-main">
                    <div className="footer-brand">
                        <h3 className="footer-brand-title">Polyglotte</h3>
                        <p className="footer-brand-description">
                            Votre compagnon pour maîtriser les langues du monde entier.
                            Apprenez à votre rythme avec des méthodes modernes et efficaces.
                        </p>
                        <div className="footer-social">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="footer-social-link"
                                    aria-label={social.name}
                                    title={social.name}
                                >
                                    <span className="footer-social-icon">{social.icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="footer-sections">
                        {footerSections.map((section) => (
                            <div key={section.title} className="footer-section">
                                <h4 className="footer-section-title">{section.title}</h4>
                                <ul className="footer-section-links">
                                    {section.links.map((link) => (
                                        <li key={link.label}>
                                            <a href={link.href} className="footer-link">
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p className="footer-copyright">
                            © {currentYear} Polyglotte. Tous droits réservés.
                        </p>
                        <div className="footer-bottom-links">
                            <a href="#" className="footer-bottom-link">Confidentialité</a>
                            <a href="#" className="footer-bottom-link">Conditions d'utilisation</a>
                            <a href="#" className="footer-bottom-link">Cookies</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;