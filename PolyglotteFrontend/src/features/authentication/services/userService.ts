import { userApiService } from "../../users/services/userApiService";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from "../../users/types/user";

/**
 * Service legacy pour les utilisateurs
 * @deprecated Utiliser userApiService depuis features/users/ directement
 * Ce wrapper existe pour compatibilité rétroactive
 */
export const userService = {
  /**
   * @deprecated Utiliser userApiService.getAll() directement
   */
  async getAllUsers(): Promise<User[]> {
    return await userApiService.getAll();
  },

  /**
   * @deprecated Utiliser userApiService.getById() directement
   */
  async getUserById(id: string): Promise<User> {
    return await userApiService.getById(id);
  },

  /**
   * @deprecated Utiliser userApiService.create() directement
   */
  async createUser(userData: CreateUserRequest): Promise<User> {
    return await userApiService.create(userData);
  },

  /**
   * @deprecated Utiliser userApiService.update() directement
   */
  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    return await userApiService.update(id, userData);
  },

  /**
   * @deprecated Utiliser userApiService.delete() directement
   */
  async deleteUser(id: string): Promise<void> {
    return await userApiService.delete(id);
  },
};
