using Polyglotte.Domain.Entities;

namespace Polyglotte.Domain.Interfaces
{
    public interface IUserRepository
    {
        // Méthodes de base (existantes)
        Task<User?> GetUserByIdAsync(string userId);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task CreateUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(string userId);

        // Méthodes de recherche supplémentaires
        Task<User?> GetUserByUsernameAsync(string username);
        Task<User?> GetUserByEmailAsync(string email);

        // Méthodes de vérification d'existence
        Task<bool> UserExistsAsync(string userId);
        Task<bool> UsernameExistsAsync(string username);
        Task<bool> EmailExistsAsync(string email);

        // Méthodes de recherche et pagination
        Task<IEnumerable<User>> SearchUsersByUsernameAsync(string searchTerm);
        Task<long> GetTotalUsersCountAsync();
        Task<IEnumerable<User>> GetUsersPaginatedAsync(int skip, int limit);
    }
}