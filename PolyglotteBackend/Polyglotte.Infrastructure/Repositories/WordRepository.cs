using MongoDB.Driver;
using Polyglotte.Domain.Entities;
using Polyglotte.Domain.Interfaces;
using Polyglotte.Infrastructure.Documents;

namespace Polyglotte.Infrastructure.Repositories
{
    public class WordRepository : IWordRepository
    {
        private readonly MongoDbContext.MongoDbContext _context;

        public WordRepository(MongoDbContext.MongoDbContext context)
        {
            _context = context;
        }

        public async Task<Word> CreateWordAsync(Word word, CancellationToken cancellationToken = default)
        {
            var doc = ToDocument(word);
            await _context.Words.InsertOneAsync(doc, cancellationToken: cancellationToken);
            return ToDomain(doc); // Return a new domain object with the generated ID
        }

        public async Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default)
        {
            var result = await _context.Words.DeleteOneAsync(d => d.Id == id, cancellationToken);
            return result.DeletedCount > 0;
        }

        public async Task<IEnumerable<Word>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            var docs = await _context.Words.Find(FilterDefinition<WordDocument>.Empty).ToListAsync(cancellationToken);
            var list = new List<Word>();
            foreach (var d in docs) list.Add(ToDomain(d));
            return list;
        }

        public async Task<Word?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
        {
            var doc = await _context.Words.Find(d => d.Id == id).FirstOrDefaultAsync(cancellationToken);
            return doc is null ? null : ToDomain(doc);
        }

        public async Task<bool> UpdateWordAsync(Word word, CancellationToken cancellationToken = default)
        {
            var update = Builders<WordDocument>.Update
                .Set(d => d.EnglishWord, word.EnglishWord)
                .Set(d => d.FrenchWord, word.FrenchWord);

            var result = await _context.Words.UpdateOneAsync(d => d.Id == word.Id, update, cancellationToken: cancellationToken);
            return result.ModifiedCount > 0;
        }

        private static WordDocument ToDocument(Word w)
        {
            var doc = new WordDocument
            {
                UserId = w.UserId,
                EnglishWord = w.EnglishWord,
                FrenchWord = w.FrenchWord,
                CreatedAt = w.CreatedAt
            };

            if (!string.IsNullOrEmpty(w.Id))
            {
                doc.Id = w.Id;
            }

            return doc;
        }


        private static Word ToDomain(WordDocument d) => new Word
        {
            Id = d.Id,
            UserId = d.UserId,
            EnglishWord = d.EnglishWord,
            FrenchWord = d.FrenchWord,
            CreatedAt = d.CreatedAt
        };
    }
}