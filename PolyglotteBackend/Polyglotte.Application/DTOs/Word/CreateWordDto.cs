namespace Polyglotte.Application.DTOs.Word
{
    public class CreateWordDto
    {
        public string UserId { get; set; } = string.Empty;
        public string EnglishWord { get; set; } = string.Empty;
        public string FrenchWord { get; set; } = string.Empty;
    }
}