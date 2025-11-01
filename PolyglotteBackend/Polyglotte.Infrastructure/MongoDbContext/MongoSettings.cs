namespace Polyglotte.Infrastructure.MongoDbContext
{
    public class MongoSettings
    {
        public string ConnectionString { get; set; } = "mongodb://localhost:27017";
        public string DatabaseName { get; set; } = "PolyglotteDb";
        public string UsersCollectionName { get; set; } = "users";
        public string WordsCollectionName { get; set; } = "words";
    }
}