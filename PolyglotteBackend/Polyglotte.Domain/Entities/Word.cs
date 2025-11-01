namespace Polyglotte.Domain.Entities
{
    public class Word
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string EnglishWord { get; set; } = string.Empty;
        public string FrenchWord { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public Word()
        {
            CreatedAt = DateTime.UtcNow;
        }
    }
}