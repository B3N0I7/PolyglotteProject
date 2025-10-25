namespace Polyglotte.Infrastructure.Persistence.Mongo.MongoDbOptions
{
    public class MongoDbOptions
    {
        public string ConnectionString { get; set; } = "mongodb://localhost:27017";
        public string Database { get; set; } = "PolyglotteDev";
    }
}
