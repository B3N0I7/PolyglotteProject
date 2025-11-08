// Types pour l'utilisateur
export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: string;
}

// DTOs pour les requêtes API
export interface CreateUserRequest {
    username: string;
    email: string;
}

export interface UpdateUserRequest {
    username?: string;
    email?: string;
}

// Types pour l'authentification (pour usage futur)
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}