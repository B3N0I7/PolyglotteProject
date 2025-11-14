import type { LoginRequest, RegisterRequest, AuthResponse, User, UserWithPassword } from '../types';
import { ApiError } from './apiClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7081/api';

export const authService = {
    async register(userData: RegisterRequest): Promise<AuthResponse> {
        try {
            // Mapper les données frontend vers le format API backend
            const createUserDto = {
                username: userData.userName,
                email: userData.email,
                password: userData.password
            };

            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(createUserDto)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);

                // Gestion des erreurs spécifiques du backend
                if (response.status === 400) {
                    throw new Error('Données invalides. Vérifiez le nom d\'utilisateur et l\'email.');
                } else if (response.status === 500 && errorData?.detail) {
                    if (errorData.detail.includes('Username') && errorData.detail.includes('already exists')) {
                        throw new Error('Ce nom d\'utilisateur existe déjà');
                    } else if (errorData.detail.includes('Email') && errorData.detail.includes('already exists')) {
                        throw new Error('Cet email est déjà utilisé');
                    }
                }

                throw new Error(errorData?.detail || `Erreur ${response.status}: ${response.statusText}`);
            }

            const userResponse: UserWithPassword = await response.json();

            // Simuler un token JWT (à remplacer par la vraie authentification backend)
            const mockToken = `jwt-token-${userResponse.id}-${Date.now()}`;

            const authResponse: AuthResponse = {
                user: {
                    id: userResponse.id,
                    username: userResponse.username,
                    email: userResponse.email,
                    createdAt: userResponse.createdAt
                },
                token: mockToken
            };

            // Stocker dans localStorage
            localStorage.setItem('authToken', authResponse.token);
            localStorage.setItem('user', JSON.stringify(authResponse.user));

            return authResponse;

        } catch (error) {
            console.error('Erreur lors de l\'enregistrement:', error);
            throw error;
        }
    },

    async login(credentials: LoginRequest): Promise<AuthResponse> {
        try {
            // Récupération de l'utilisateur par email
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Erreur de connexion au serveur');
            }

            const users: UserWithPassword[] = await response.json();
            const user = users.find((u: UserWithPassword) => u.email === credentials.email);

            if (!user) {
                throw new Error('Email ou mot de passe incorrect');
            }

            // Validation du mot de passe avec celui stocké dans la base de données
            // Note: En production, la validation devrait être faite côté backend pour des raisons de sécurité
            if (user.password !== credentials.password) {
                throw new Error('Email ou mot de passe incorrect');
            }

            const mockToken = `jwt-token-${user.id}-${Date.now()}`;

            const authResponse: AuthResponse = {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt
                },
                token: mockToken
            };

            localStorage.setItem('authToken', authResponse.token);
            localStorage.setItem('user', JSON.stringify(authResponse.user));

            return authResponse;

        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            throw error;
        }
    },

    async logout(): Promise<void> {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('authToken');
    },

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getAuthToken(): string | null {
        return localStorage.getItem('authToken');
    },
};