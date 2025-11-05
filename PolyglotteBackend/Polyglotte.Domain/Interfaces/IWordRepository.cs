using Polyglotte.Domain.Entities;

namespace Polyglotte.Domain.Interfaces
{
    public interface IWordRepository
    {
        Task<IEnumerable<Word>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<Word?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
        Task<Word> CreateWordAsync(Word word, CancellationToken cancellationToken = default);
        Task<bool> UpdateAsync(Word word, CancellationToken cancellationToken = default);
        Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default);
    }
}