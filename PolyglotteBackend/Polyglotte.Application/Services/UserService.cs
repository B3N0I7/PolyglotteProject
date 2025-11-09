using Polyglotte.Application.DTOs.User;
using Polyglotte.Application.Interfaces;
using Polyglotte.Application.Mappings;
using Polyglotte.Domain.Interfaces;

namespace Polyglotte.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly UserMapper _userMapper;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
        _userMapper = new UserMapper();
    }

    public async Task<IEnumerable<UserResponse>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllUsersAsync();
        return users.Select(_userMapper.ToResponse);
    }

    public async Task<UserResponse> CreateUserAsync(CreateUserDto createUserDto)
    {
        // Validation des entrées
        if (string.IsNullOrWhiteSpace(createUserDto.Username))
            throw new ArgumentException("Username cannot be null or empty", nameof(createUserDto.Username));

        if (string.IsNullOrWhiteSpace(createUserDto.Email))
            throw new ArgumentException("Email cannot be null or empty", nameof(createUserDto.Email));

        if (string.IsNullOrWhiteSpace(createUserDto.Password))
            throw new ArgumentException("Password cannot be null or empty", nameof(createUserDto.Password));

        // Vérification d'unicité
        if (await _userRepository.UsernameExistsAsync(createUserDto.Username))
            throw new InvalidOperationException($"Username '{createUserDto.Username}' already exists");

        if (await _userRepository.EmailExistsAsync(createUserDto.Email))
            throw new InvalidOperationException($"Email '{createUserDto.Email}' already exists");

        var user = _userMapper.ToEntity(createUserDto);
        user.CreatedAt = DateTime.UtcNow;

        await _userRepository.CreateUserAsync(user);
        return _userMapper.ToResponse(user);
    }

    public async Task<UserResponse?> GetUserByIdAsync(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
            return null;

        var user = await _userRepository.GetUserByIdAsync(id);
        return user == null ? null : _userMapper.ToResponse(user);
    }

    public async Task<UserResponse?> UpdateUserAsync(string id, UpdateUserDto updateUserDto)
    {
        if (string.IsNullOrWhiteSpace(id))
            return null;

        // Validation des entrées
        if (string.IsNullOrWhiteSpace(updateUserDto.Username))
            throw new ArgumentException("Username cannot be null or empty", nameof(updateUserDto.Username));

        if (string.IsNullOrWhiteSpace(updateUserDto.Email))
            throw new ArgumentException("Email cannot be null or empty", nameof(updateUserDto.Email));

        var user = await _userRepository.GetUserByIdAsync(id);
        if (user == null) return null;

        // Vérification d'unicité seulement si les valeurs ont changé
        if (user.Username != updateUserDto.Username && await _userRepository.UsernameExistsAsync(updateUserDto.Username))
            throw new InvalidOperationException($"Username '{updateUserDto.Username}' already exists");

        if (user.Email != updateUserDto.Email && await _userRepository.EmailExistsAsync(updateUserDto.Email))
            throw new InvalidOperationException($"Email '{updateUserDto.Email}' already exists");

        user.Username = updateUserDto.Username;
        user.Email = updateUserDto.Email;

        await _userRepository.UpdateUserAsync(user);
        return _userMapper.ToResponse(user);
    }

    public async Task<bool> DeleteUserAsync(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
            return false;

        if (!await _userRepository.UserExistsAsync(id))
            return false;

        await _userRepository.DeleteUserAsync(id);
        return true;
    }
}
