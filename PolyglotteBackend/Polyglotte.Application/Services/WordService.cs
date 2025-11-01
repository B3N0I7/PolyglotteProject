using Polyglotte.Application.DTOs.Word;
using Polyglotte.Application.Interfaces;
using Polyglotte.Application.Mappings;
using Polyglotte.Domain.Interfaces;

namespace Polyglotte.Application.Services
{
    public class WordService : IWordService
    {
        private readonly IWordRepository _repository;

        public WordService(IWordRepository repository)
        {
            _repository = repository;
        }

        public async Task<WordResponse> CreateAsync(CreateWordDto dto, CancellationToken cancellationToken = default)
        {
            var word = WordMapper.ToEntity(dto);
            var created = await _repository.CreateAsync(word, cancellationToken);
            return WordMapper.ToResponse(created);
        }

        public async Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default)
        {
            return await _repository.DeleteAsync(id, cancellationToken);
        }

        public async Task<IEnumerable<WordResponse>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            var words = await _repository.GetAllAsync(cancellationToken);
            return words.Select(WordMapper.ToResponse);
        }

        public async Task<WordResponse?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
        {
            var word = await _repository.GetByIdAsync(id, cancellationToken);
            return word is null ? null : WordMapper.ToResponse(word);
        }

        public async Task<bool> UpdateAsync(string id, UpdateWordDto dto, CancellationToken cancellationToken = default)
        {
            var existing = await _repository.GetByIdAsync(id, cancellationToken);
            if (existing is null) return false;

            WordMapper.ToEntity(dto, existing);

            return await _repository.UpdateAsync(existing, cancellationToken);
        }
    }
}