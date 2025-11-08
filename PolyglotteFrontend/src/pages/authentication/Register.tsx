import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../layouts';
import { useAuth } from '../../app/providers';
import type { RegisterRequest } from '../../types';
import './Auth.css';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState<RegisterRequest & { confirmPassword: string; acceptTerms: boolean }>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Le prénom est requis';
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = 'Le prénom doit contenir au moins 2 caractères';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Le nom est requis';
        } else if (formData.lastName.trim().length < 2) {
            newErrors.lastName = 'Le nom doit contenir au moins 2 caractères';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'L\'email n\'est pas valide';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Le mot de passe est requis';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
        }

        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            await register(formData.firstName, formData.lastName, formData.email, formData.password);
            navigate('/');
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            setErrors({
                general: error instanceof Error ? error.message : 'Erreur lors de l\'inscription. Veuillez réessayer.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="auth-container">
                <div className="auth-card register-card">
                    <div className="auth-header">
                        <h1>Créer un compte</h1>
                        <p>Rejoignez la communauté Polyglotte et commencez votre apprentissage</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {errors.general && (
                            <div className="error-message general-error">
                                {errors.general}
                            </div>
                        )}

                        <div className="form-row">
                            <div className="form-group half-width">
                                <label htmlFor="firstName">Prénom</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={errors.firstName ? 'error' : ''}
                                    placeholder="Jean"
                                    autoComplete="given-name"
                                />
                                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                            </div>

                            <div className="form-group half-width">
                                <label htmlFor="lastName">Nom</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={errors.lastName ? 'error' : ''}
                                    placeholder="Dupont"
                                    autoComplete="family-name"
                                />
                                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? 'error' : ''}
                                placeholder="jean.dupont@email.com"
                                autoComplete="email"
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Mot de passe</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={errors.password ? 'error' : ''}
                                placeholder="••••••••"
                                autoComplete="new-password"
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                            <small className="password-hint">
                                Au moins 8 caractères avec une majuscule, une minuscule et un chiffre
                            </small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={errors.confirmPassword ? 'error' : ''}
                                placeholder="••••••••"
                                autoComplete="new-password"
                            />
                            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="acceptTerms"
                                    checked={formData.acceptTerms}
                                    onChange={handleChange}
                                />
                                <span className="checkmark"></span>
                                J'accepte les <a href="#" className="terms-link">conditions d'utilisation</a> et la <a href="#" className="terms-link">politique de confidentialité</a>
                            </label>
                            {errors.acceptTerms && <span className="error-message">{errors.acceptTerms}</span>}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary auth-submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Création du compte...' : 'Créer mon compte'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Déjà un compte?
                            <Link to="/connexion" className="auth-link">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Register;