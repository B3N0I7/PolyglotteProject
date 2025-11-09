using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Polyglotte.Infrastructure.Documents
{
    public class UserDocument
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("username")]
        public string Username { get; set; }

        [BsonElement("email")]
        public string Email { get; set; }

        [BsonElement("password")]
        public string Password { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }
    }
}