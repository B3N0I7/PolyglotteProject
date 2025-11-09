using MongoDB.Bson;
using MongoDB.Driver;
using Polyglotte.Domain.Entities;
using Polyglotte.Domain.Interfaces;
using Polyglotte.Infrastructure.Documents;

namespace Polyglotte.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly MongoDbContext.MongoDbContext _context;
        private readonly IMongoCollection<UserDocument> _users;

        public UserRepository(MongoDbContext.MongoDbContext context)
        {
            _context = context;
            _users = _context.Users;
        }

        public async Task<User?> GetUserByIdAsync(string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return null;

            if (!ObjectId.TryParse(userId, out var objectId))
                return null;

            var userDocument = await _users
                .Find(u => u.Id == objectId)
                .FirstOrDefaultAsync();

            return userDocument != null ? MapToEntity(userDocument) : null;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            var userDocuments = await _users
                .Find(_ => true)
                .SortBy(u => u.CreatedAt)
                .ToListAsync();

            return userDocuments.Select(MapToEntity);
        }

        public async Task CreateUserAsync(User user)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));

            var userDocument = MapToDocument(user);
            await _users.InsertOneAsync(userDocument);

            // Update the entity with the generated ID
            user.Id = userDocument.Id.ToString();
        }

        public async Task UpdateUserAsync(User user)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));

            if (string.IsNullOrEmpty(user.Id))
                throw new ArgumentException("User ID cannot be null or empty", nameof(user));

            if (!ObjectId.TryParse(user.Id, out var objectId))
                throw new ArgumentException("Invalid User ID format", nameof(user));

            var userDocument = MapToDocument(user);
            userDocument.Id = objectId;

            var result = await _users.ReplaceOneAsync(
                u => u.Id == objectId,
                userDocument);

            if (result.MatchedCount == 0)
                throw new InvalidOperationException($"User with ID {user.Id} not found");
        }

        public async Task DeleteUserAsync(string userId)
        {
            if (string.IsNullOrEmpty(userId))
                throw new ArgumentException("User ID cannot be null or empty", nameof(userId));

            if (!ObjectId.TryParse(userId, out var objectId))
                throw new ArgumentException("Invalid User ID format", nameof(userId));

            var result = await _users.DeleteOneAsync(u => u.Id == objectId);

            if (result.DeletedCount == 0)
                throw new InvalidOperationException($"User with ID {userId} not found");
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            if (string.IsNullOrEmpty(username))
                return null;

            var userDocument = await _users
                .Find(u => u.Username == username)
                .FirstOrDefaultAsync();

            return userDocument != null ? MapToEntity(userDocument) : null;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            if (string.IsNullOrEmpty(email))
                return null;

            var userDocument = await _users
                .Find(u => u.Email == email)
                .FirstOrDefaultAsync();

            return userDocument != null ? MapToEntity(userDocument) : null;
        }

        public async Task<bool> UserExistsAsync(string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return false;

            if (!ObjectId.TryParse(userId, out var objectId))
                return false;

            var count = await _users.CountDocumentsAsync(u => u.Id == objectId);
            return count > 0;
        }

        public async Task<bool> UsernameExistsAsync(string username)
        {
            if (string.IsNullOrEmpty(username))
                return false;

            var count = await _users.CountDocumentsAsync(u => u.Username == username);
            return count > 0;
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            if (string.IsNullOrEmpty(email))
                return false;

            var count = await _users.CountDocumentsAsync(u => u.Email == email);
            return count > 0;
        }

        public async Task<IEnumerable<User>> SearchUsersByUsernameAsync(string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm))
                return Enumerable.Empty<User>();

            var filter = Builders<UserDocument>.Filter.Regex(
                u => u.Username,
                new BsonRegularExpression(searchTerm, "i"));

            var userDocuments = await _users
                .Find(filter)
                .SortBy(u => u.Username)
                .ToListAsync();

            return userDocuments.Select(MapToEntity);
        }

        public async Task<long> GetTotalUsersCountAsync()
        {
            return await _users.CountDocumentsAsync(_ => true);
        }

        public async Task<IEnumerable<User>> GetUsersPaginatedAsync(int skip, int limit)
        {
            var userDocuments = await _users
                .Find(_ => true)
                .SortBy(u => u.CreatedAt)
                .Skip(skip)
                .Limit(limit)
                .ToListAsync();

            return userDocuments.Select(MapToEntity);
        }

        private static User MapToEntity(UserDocument document)
        {
            return new User
            {
                Id = document.Id.ToString(),
                Username = document.Username ?? string.Empty,
                Email = document.Email ?? string.Empty,
                Password = document.Password ?? string.Empty,
                CreatedAt = document.CreatedAt
            };
        }

        private static UserDocument MapToDocument(User entity)
        {
            return new UserDocument
            {
                Username = entity.Username,
                Email = entity.Email,
                Password = entity.Password,
                CreatedAt = entity.CreatedAt
            };
        }
    }
}