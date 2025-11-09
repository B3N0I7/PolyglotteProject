import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../layouts';
import { useAuth } from '../../app/providers';
import type { RegisterRequest } from '../../types';
import { validateEmail, validatePassword, validateName, handleApiError } from '../../utils/validation';
import './Auth.css';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState<RegisterRequest & { confirmPassword: string; acceptTerms: boolean }>({
        userName: '',
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

        // Validation userName
        const userNameValidation = validateName(formData.userName, 'nom d\'utilisateur');
        if (!userNameValidation.isValid) {
            newErrors.userName = userNameValidation.message!;
        }

        // Validation email
        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'L\'email n\'est pas valide';
        }

        // Validation mot de passe
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            newErrors.password = passwordValidation.message!;
        }

        // Validation confirmation mot de passe
        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        // Validation acceptation des conditions
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
            await register(formData.userName, formData.email, formData.password);
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            setErrors({
                general: handleApiError(error, 'Erreur lors de l\'inscription. Veuillez réessayer.')
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
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {errors.general && (
                            <div className="error-message general-error">
                                {errors.general}
                            </div>
                        )}

                        <div className="form-row">
                            <div className="form-group half-width">
                                <label htmlFor="userName">Nom d'utilisateur</label>
                                <input
                                    type="text"
                                    id="userName"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    className={errors.userName ? 'error' : ''}
                                    placeholder="Jean"
                                    autoComplete="given-name"
                                    disabled={isLoading}
                                />
                                {errors.userName && <span className="error-message">{errors.userName}</span>}
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
                                disabled={isLoading}
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
                                disabled={isLoading}
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
                                disabled={isLoading}
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
                                    disabled={isLoading}
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