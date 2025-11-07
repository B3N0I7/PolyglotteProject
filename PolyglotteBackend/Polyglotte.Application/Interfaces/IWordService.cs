using Polyglotte.Application.DTOs.Word;

namespace Polyglotte.Application.Interfaces
{
    public interface IWordService
    {
        Task<IEnumerable<WordResponse>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<WordResponse?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
        Task<WordResponse> CreateWordAsync(CreateWordDto dto, CancellationToken cancellationToken = default);
        Task<bool> UpdateWordAsync(string id, UpdateWordDto dto, CancellationToken cancellationToken = default);
        Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default);
    }
}