using System;

namespace Polyglotte.Application.DTOs
{
    public class WordResponse
    {
        public string Id { get; set; } = string.Empty;
        public string EnglishWord { get; set; } = string.Empty;
        public string FrenchWord { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}