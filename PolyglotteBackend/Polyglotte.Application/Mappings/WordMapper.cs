using Polyglotte.Application.DTOs.Word;
using Polyglotte.Domain.Entities;

namespace Polyglotte.Application.Mappings
{
    public static class WordMapper
    {
        public static Word ToEntity(CreateWordDto dto)
        {
            return new Word
            {
                UserId = dto.UserId,
                EnglishWord = dto.EnglishWord,
                FrenchWord = dto.FrenchWord,
                CreatedAt = DateTime.UtcNow
            };
        }

        public static void ToEntity(UpdateWordDto dto, Word entity)
        {
            entity.EnglishWord = dto.EnglishWord;
            entity.FrenchWord = dto.FrenchWord;
        }

        public static WordResponse ToResponse(Word entity)
        {
            return new WordResponse
            {
                Id = entity.Id,
                UserId = entity.UserId,
                EnglishWord = entity.EnglishWord,
                FrenchWord = entity.FrenchWord,
                CreatedAt = entity.CreatedAt
            };
        }
    }
}
