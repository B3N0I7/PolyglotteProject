using Polyglotte.Application.DTOs;

namespace Polyglotte.Application.Interfaces
{
    public interface IWordService
    {
        Task<IEnumerable<WordResponse>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<WordResponse?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
        Task<WordResponse> CreateAsync(CreateWordDto dto, CancellationToken cancellationToken = default);
        Task<bool> UpdateAsync(string id, UpdateWordDto dto, CancellationToken cancellationToken = default);
        Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default);
    }
}