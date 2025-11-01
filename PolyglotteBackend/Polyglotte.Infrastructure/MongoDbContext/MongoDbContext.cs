using MongoDB.Driver;
using Polyglotte.Infrastructure.Documents;

namespace Polyglotte.Infrastructure.MongoDbContext
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;
        private readonly MongoSettings _settings;

        public MongoDbContext(MongoSettings settings)
        {
            _settings = settings;
            var client = new MongoClient(_settings.ConnectionString);
            _database = client.GetDatabase(_settings.DatabaseName);
        }

        public IMongoCollection<WordDocument> Words => _database.GetCollection<WordDocument>(_settings.WordsCollectionName);
        public IMongoCollection<UserDocument> Users => _database.GetCollection<UserDocument>(_settings.UsersCollectionName);
    }
}