import { apiClient, ApiError } from './apiClient';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types';

export const userService = {
    async getAllUsers(): Promise<User[]> {
        try {
            return await apiClient.get<User[]>('/users');
        } catch (error) {
            throw new Error('Erreur lors de la récupération des utilisateurs');
        }
    },

    async getUserById(id: string): Promise<User> {
        try {
            return await apiClient.get<User>(`/users/${id}`);
        } catch (error) {
            if (error instanceof ApiError && error.status === 404) {
                throw new Error('Utilisateur non trouvé');
            }
            throw new Error('Erreur lors de la récupération de l\'utilisateur');
        }
    },

    async createUser(userData: CreateUserRequest): Promise<User> {
        try {
            return await apiClient.post<User>('/users', userData);
        } catch (error) {
            if (error instanceof ApiError && error.status === 400) {
                throw new Error('Données utilisateur invalides');
            } else if (error instanceof ApiError && error.status === 500) {
                throw new Error('Nom d\'utilisateur ou email déjà existant');
            }
            throw new Error('Erreur lors de la création de l\'utilisateur');
        }
    },

    async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
        try {
            return await apiClient.put<User>(`/users/${id}`, userData);
        } catch (error) {
            if (error instanceof ApiError && error.status === 404) {
                throw new Error('Utilisateur non trouvé');
            } else if (error instanceof ApiError && error.status === 400) {
                throw new Error('Données de mise à jour invalides');
            }
            throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
        }
    },

    async deleteUser(id: string): Promise<void> {
        try {
            return await apiClient.delete(`/users/${id}`);
        } catch (error) {
            if (error instanceof ApiError && error.status === 404) {
                throw new Error('Utilisateur non trouvé');
            }
            throw new Error('Erreur lors de la suppression de l\'utilisateur');
        }
    },
};