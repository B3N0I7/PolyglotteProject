using Polyglotte.Application.DTOs.User;

namespace Polyglotte.Application.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserResponse>> GetAllUsersAsync();
        Task<UserResponse> CreateUserAsync(CreateUserDto createUserDto);
        Task<UserResponse> GetUserByIdAsync(string userId);
        Task<UserResponse> UpdateUserAsync(string userId, UpdateUserDto updateUserDto);
        Task<bool> DeleteUserAsync(string userId);
    }
}