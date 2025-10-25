using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Polyglotte.Infrastructure.Documents
{
    public class WordDocument
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("english")]
        public string EnglishWord { get; set; } = string.Empty;

        [BsonElement("french")]
        public string FrenchWord { get; set; } = string.Empty;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }
    }
}