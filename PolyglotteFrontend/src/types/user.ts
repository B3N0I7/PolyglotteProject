// Types pour l'utilisateur (sans mot de passe pour la sécurité côté frontend)
export interface User {
    id: string;
    userName: string;
    email: string;
    createdAt: string;
}

// Type complet utilisateur pour les réponses de l'API (avec mot de passe)
export interface UserWithPassword {
    id: string;
    userName: string;
    email: string;
    password: string;
    createdAt: string;
}

// DTOs pour les requêtes API
export interface CreateUserRequest {
    userName: string;
    email: string;
    password: string;
}

export interface UpdateUserRequest {
    userName?: string;
    email?: string;
    password?: string;
}

// Types pour l'authentification (pour usage futur)
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    userName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}