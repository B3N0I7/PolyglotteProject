import { apiClient } from './apiClient';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types';

export const userService = {
    async getAllUsers(): Promise<User[]> {
        return apiClient.get<User[]>('/users');
    },

    async getUserById(id: string): Promise<User> {
        return apiClient.get<User>(`/users/${id}`);
    },

    async createUser(userData: CreateUserRequest): Promise<User> {
        return apiClient.post<User>('/users', userData);
    },

    async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
        return apiClient.put<User>(`/users/${id}`, userData);
    },

    async deleteUser(id: string): Promise<void> {
        return apiClient.delete(`/users/${id}`);
    },
};