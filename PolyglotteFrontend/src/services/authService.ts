import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

// Service d'authentification temporaire (simulation)
// À remplacer par la vraie API d'authentification quand elle sera disponible
export const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        // Simulation d'un appel API
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulation de validation
        if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
            const mockResponse: AuthResponse = {
                user: {
                    id: '1',
                    username: 'testuser',
                    email: credentials.email,
                    createdAt: new Date().toISOString(),
                },
                token: 'mock-jwt-token-' + Date.now(),
            };

            // Stocker le token dans le localStorage
            localStorage.setItem('authToken', mockResponse.token);
            localStorage.setItem('user', JSON.stringify(mockResponse.user));

            return mockResponse;
        } else {
            throw new Error('Email ou mot de passe incorrect');
        }
    },

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        // Simulation d'un appel API
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockResponse: AuthResponse = {
            user: {
                id: Date.now().toString(),
                username: `${userData.firstName.toLowerCase()}${userData.lastName.toLowerCase()}`,
                email: userData.email,
                createdAt: new Date().toISOString(),
            },
            token: 'mock-jwt-token-' + Date.now(),
        };

        // Stocker le token dans le localStorage
        localStorage.setItem('authToken', mockResponse.token);
        localStorage.setItem('user', JSON.stringify(mockResponse.user));

        return mockResponse;
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