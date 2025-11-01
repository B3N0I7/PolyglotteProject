using Polyglotte.Application.DTOs.User;
using Polyglotte.Domain.Entities;

namespace Polyglotte.Application.Mappings
{
    public class UserMapper
    {
        public User ToEntity(CreateUserDto dto)
        {
            return new User
            {
                Username = dto.Username,
                Email = dto.Email
            };
        }

        public void UpdateEntity(User user, UpdateUserDto dto)
        {
            user.Username = dto.Username;
            user.Email = dto.Email;
        }

        public UserResponse ToResponse(User user)
        {
            return new UserResponse
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                CreatedAt = user.CreatedAt
            };
        }
    }
}