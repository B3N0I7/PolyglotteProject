import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../layouts';
import { useAuth } from '../../app/providers';
import type { LoginRequest } from '../../types';
import './Auth.css';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState<LoginRequest>({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'L\'email n\'est pas valide';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Le mot de passe est requis';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            await login(formData.email, formData.password);
            navigate('/');
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            setErrors({
                general: error instanceof Error ? error.message : 'Erreur lors de la connexion. Veuillez réessayer.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Connexion</h1>
                        <p>Connectez-vous à votre compte Polyglotte</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {errors.general && (
                            <div className="error-message general-error">
                                {errors.general}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? 'error' : ''}
                                placeholder="votre@email.com"
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
                                autoComplete="current-password"
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" />
                                <span className="checkmark"></span>
                                Se souvenir de moi
                            </label>
                            <a href="#" className="forgot-password">Mot de passe oublié?</a>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary auth-submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Pas encore de compte?
                            <Link to="/inscription" className="auth-link">
                                Créer un compte
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Login;