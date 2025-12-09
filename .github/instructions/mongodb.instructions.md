---
applyTo: "PolyglotteBackend/Polyglotte.Infrastructure/**/*.cs"
---

# Instructions MongoDB pour Polyglotte

Ce document définit les bonnes pratiques pour l'utilisation de MongoDB dans le projet Polyglotte.

## Architecture et Séparation des Responsabilités

### 1. Structure des Dossiers

```
Polyglotte.Infrastructure/
├── MongoDbContext/
│   ├── MongoDbContext.cs      # Configuration des collections
│   └── MongoSettings.cs       # Paramètres de connexion
├── Documents/
│   ├── UserDocument.cs        # Modèles MongoDB (BSON)
│   └── WordDocument.cs
├── Repositories/
│   ├── UserRepository.cs      # Implémentations IRepository
│   └── WordRepository.cs
└── Migrations/                # Scripts de migration optionnels
```

### 2. Séparation Domain vs Infrastructure

**DO** : Séparer les entités de domaine et les documents MongoDB

```csharp
// ✅ Domain/Entities/User.cs
namespace Polyglotte.Domain.Entities
{
    public class User
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

// ✅ Infrastructure/Documents/UserDocument.cs
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
```

**DON'T DO** : Exposer les types MongoDB dans le domaine

```csharp
// ❌ Ne jamais utiliser ObjectId ou attributs MongoDB dans Domain
using MongoDB.Bson;

namespace Polyglotte.Domain.Entities
{
    public class User
    {
        [BsonId] // ❌ Couplage avec MongoDB
        public ObjectId Id { get; set; }

        public string Username { get; set; }
    }
}
```

## Conventions de Nommage MongoDB

### 1. Collections

**DO** : Utiliser des noms pluriels en minuscules

```csharp
// ✅ Bon
public class MongoSettings
{
    public string UsersCollectionName { get; set; } = "users";
    public string WordsCollectionName { get; set; } = "words";
    public string VocabulariesCollectionName { get; set; } = "vocabularies";
}
```

**DON'T DO** : Éviter PascalCase ou singulier

```csharp
// ❌ À éviter
public class MongoSettings
{
    public string UserCollectionName { get; set; } = "User"; // ❌ Singulier + PascalCase
    public string WordsCollectionName { get; set; } = "Words"; // ❌ PascalCase
}
```

### 2. Champs de Documents

**DO** : Utiliser camelCase pour les noms de champs

```csharp
// ✅ Bon
public class UserDocument
{
    [BsonElement("username")]
    public string Username { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; }

    [BsonElement("lastLoginDate")]
    public DateTime? LastLoginDate { get; set; }
}
```

**DON'T DO** : Éviter PascalCase dans les documents

```csharp
// ❌ À éviter
public class UserDocument
{
    [BsonElement("Username")] // ❌ PascalCase
    public string Username { get; set; }

    public DateTime CreatedAt { get; set; } // ❌ Pas d'attribut BsonElement
}
```

## Mapping entre Entités et Documents

### 1. Méthodes de Mapping Privées

**DO** : Créer des méthodes de mapping dans les repositories

```csharp
// ✅ Bon
public class UserRepository : IUserRepository
{
    private readonly IMongoCollection<UserDocument> _users;

    private static User MapToEntity(UserDocument document)
    {
        return new User
        {
            Id = document.Id.ToString(),
            Username = document.Username,
            Email = document.Email,
            Password = document.Password,
            CreatedAt = document.CreatedAt
        };
    }

    private static UserDocument MapToDocument(User entity)
    {
        var document = new UserDocument
        {
            Username = entity.Username,
            Email = entity.Email,
            Password = entity.Password,
            CreatedAt = entity.CreatedAt
        };

        // Ne pas définir Id si c'est une nouvelle entité
        if (!string.IsNullOrEmpty(entity.Id) && ObjectId.TryParse(entity.Id, out var objectId))
        {
            document.Id = objectId;
        }

        return document;
    }

    public async Task<User?> GetUserByIdAsync(string userId)
    {
        if (!ObjectId.TryParse(userId, out var objectId))
            return null;

        var document = await _users
            .Find(u => u.Id == objectId)
            .FirstOrDefaultAsync();

        return document != null ? MapToEntity(document) : null;
    }
}
```

**DON'T DO** : Exposer les documents directement

```csharp
// ❌ À éviter
public interface IUserRepository
{
    // ❌ Ne jamais retourner des documents MongoDB
    Task<UserDocument> GetUserByIdAsync(string userId);
}
```

## Gestion des ObjectId

### 1. Validation et Parsing

**DO** : Toujours valider les ObjectId avant utilisation

```csharp
// ✅ Bon
public async Task<User?> GetUserByIdAsync(string userId)
{
    if (string.IsNullOrEmpty(userId))
        return null;

    if (!ObjectId.TryParse(userId, out var objectId))
        return null; // ou throw new ArgumentException

    var document = await _users
        .Find(u => u.Id == objectId)
        .FirstOrDefaultAsync();

    return document != null ? MapToEntity(document) : null;
}
```

**DON'T DO** : Éviter de parser sans validation

```csharp
// ❌ À éviter
public async Task<User?> GetUserByIdAsync(string userId)
{
    var objectId = new ObjectId(userId); // ❌ Peut lancer une exception

    var document = await _users
        .Find(u => u.Id == objectId)
        .FirstOrDefaultAsync();

    return document != null ? MapToEntity(document) : null;
}
```

### 2. Génération d'ID

**DO** : Laisser MongoDB générer les IDs lors de l'insertion

```csharp
// ✅ Bon
public async Task CreateUserAsync(User user)
{
    if (user == null)
        throw new ArgumentNullException(nameof(user));

    var userDocument = MapToDocument(user);
    // ObjectId sera généré automatiquement par MongoDB
    await _users.InsertOneAsync(userDocument);

    // Mettre à jour l'entité avec l'ID généré
    user.Id = userDocument.Id.ToString();
}
```

**DON'T DO** : Générer manuellement des ObjectId

```csharp
// ❌ À éviter
public async Task CreateUserAsync(User user)
{
    var userDocument = MapToDocument(user);
    userDocument.Id = ObjectId.GenerateNewId(); // ❌ Inutile, MongoDB le fait
    await _users.InsertOneAsync(userDocument);
}
```

## Requêtes et Filtres

### 1. Utiliser le Filter Builder

**DO** : Utiliser FilterDefinitionBuilder pour requêtes complexes

```csharp
// ✅ Bon
public async Task<IEnumerable<User>> SearchUsersAsync(string searchTerm, bool onlyActive)
{
    var filterBuilder = Builders<UserDocument>.Filter;
    var filter = filterBuilder.Empty;

    if (!string.IsNullOrEmpty(searchTerm))
    {
        var usernameFilter = filterBuilder.Regex(u => u.Username, new BsonRegularExpression(searchTerm, "i"));
        var emailFilter = filterBuilder.Regex(u => u.Email, new BsonRegularExpression(searchTerm, "i"));
        filter &= filterBuilder.Or(usernameFilter, emailFilter);
    }

    if (onlyActive)
    {
        filter &= filterBuilder.Eq(u => u.IsActive, true);
    }

    var documents = await _users
        .Find(filter)
        .SortBy(u => u.Username)
        .ToListAsync();

    return documents.Select(MapToEntity);
}
```

**DON'T DO** : Construire des chaînes de requête manuellement

```csharp
// ❌ À éviter
public async Task<IEnumerable<User>> SearchUsersAsync(string searchTerm)
{
    // ❌ Ne pas construire des filtres avec des chaînes
    var filter = $"{{ username: /{searchTerm}/i }}";

    // ❌ API non type-safe
    var documents = await _users.Find(filter).ToListAsync();
    return documents.Select(MapToEntity);
}
```

### 2. Utiliser des Expressions Lambda

**DO** : Préférer les expressions lambda pour filtres simples

```csharp
// ✅ Bon
public async Task<User?> GetUserByUsernameAsync(string username)
{
    if (string.IsNullOrEmpty(username))
        return null;

    var document = await _users
        .Find(u => u.Username == username)
        .FirstOrDefaultAsync();

    return document != null ? MapToEntity(document) : null;
}

public async Task<IEnumerable<User>> GetRecentUsersAsync(int count)
{
    var documents = await _users
        .Find(u => u.CreatedAt >= DateTime.UtcNow.AddDays(-7))
        .SortByDescending(u => u.CreatedAt)
        .Limit(count)
        .ToListAsync();

    return documents.Select(MapToEntity);
}
```

## Mises à Jour

### 1. ReplaceOne vs UpdateOne

**DO** : Utiliser ReplaceOne pour remplacer un document entier

```csharp
// ✅ Bon pour remplacement complet
public async Task UpdateUserAsync(User user)
{
    if (!ObjectId.TryParse(user.Id, out var objectId))
        throw new ArgumentException("Invalid User ID format");

    var userDocument = MapToDocument(user);
    userDocument.Id = objectId;

    var result = await _users.ReplaceOneAsync(
        u => u.Id == objectId,
        userDocument);

    if (result.MatchedCount == 0)
        throw new InvalidOperationException($"User with ID {user.Id} not found");
}
```

**DO** : Utiliser UpdateOne pour modifications partielles

```csharp
// ✅ Bon pour mise à jour partielle
public async Task UpdateUserEmailAsync(string userId, string newEmail)
{
    if (!ObjectId.TryParse(userId, out var objectId))
        throw new ArgumentException("Invalid User ID format");

    var update = Builders<UserDocument>.Update
        .Set(u => u.Email, newEmail)
        .Set(u => u.UpdatedAt, DateTime.UtcNow);

    var result = await _users.UpdateOneAsync(
        u => u.Id == objectId,
        update);

    if (result.MatchedCount == 0)
        throw new InvalidOperationException($"User with ID {userId} not found");
}
```

**DON'T DO** : Utiliser ReplaceOne pour petites modifications

```csharp
// ❌ À éviter - inefficace pour une petite modification
public async Task UpdateUserEmailAsync(string userId, string newEmail)
{
    var user = await GetUserByIdAsync(userId);
    if (user == null)
        throw new InvalidOperationException("User not found");

    user.Email = newEmail;
    await UpdateUserAsync(user); // ❌ Remplace tout le document
}
```

## Indexation

### 1. Créer des Index pour Performances

**DO** : Définir des index pour les champs fréquemment requis

```csharp
// ✅ Bon - dans une méthode d'initialisation
public class UserRepository : IUserRepository
{
    public async Task EnsureIndexesAsync()
    {
        var indexKeysDefinition = Builders<UserDocument>.IndexKeys
            .Ascending(u => u.Username);

        var indexOptions = new CreateIndexOptions
        {
            Unique = true,
            Name = "username_unique_idx"
        };

        await _users.Indexes.CreateOneAsync(
            new CreateIndexModel<UserDocument>(indexKeysDefinition, indexOptions));

        // Index pour recherche par email
        var emailIndexKeys = Builders<UserDocument>.IndexKeys
            .Ascending(u => u.Email);

        var emailIndexOptions = new CreateIndexOptions
        {
            Unique = true,
            Name = "email_unique_idx"
        };

        await _users.Indexes.CreateOneAsync(
            new CreateIndexModel<UserDocument>(emailIndexKeys, emailIndexOptions));

        // Index composé pour tri
        var compositeIndexKeys = Builders<UserDocument>.IndexKeys
            .Descending(u => u.CreatedAt)
            .Ascending(u => u.Username);

        await _users.Indexes.CreateOneAsync(
            new CreateIndexModel<UserDocument>(compositeIndexKeys));
    }
}
```

**DO** : Appeler l'initialisation des index au démarrage

```csharp
// ✅ Dans Program.cs ou Startup
public static async Task Main(string[] args)
{
    var app = builder.Build();

    // Initialiser les index au démarrage
    using (var scope = app.Services.CreateScope())
    {
        var userRepository = scope.ServiceProvider.GetRequiredService<IUserRepository>();
        await userRepository.EnsureIndexesAsync();
    }

    await app.RunAsync();
}
```

## Gestion des Erreurs

### 1. Exceptions Spécifiques

**DO** : Gérer les exceptions MongoDB spécifiques

```csharp
// ✅ Bon
public async Task CreateUserAsync(User user)
{
    try
    {
        var userDocument = MapToDocument(user);
        await _users.InsertOneAsync(userDocument);
        user.Id = userDocument.Id.ToString();
    }
    catch (MongoWriteException ex) when (ex.WriteError.Category == ServerErrorCategory.DuplicateKey)
    {
        throw new InvalidOperationException($"A user with username '{user.Username}' already exists", ex);
    }
    catch (MongoException ex)
    {
        throw new InvalidOperationException("An error occurred while creating the user", ex);
    }
}
```

**DON'T DO** : Ignorer ou attraper toutes les exceptions

```csharp
// ❌ À éviter
public async Task CreateUserAsync(User user)
{
    try
    {
        var userDocument = MapToDocument(user);
        await _users.InsertOneAsync(userDocument);
    }
    catch (Exception) // ❌ Trop générique
    {
        // ❌ Pas de gestion appropriée
    }
}
```

## Configuration et Injection de Dépendances

### 1. Enregistrement des Services

**DO** : Enregistrer MongoDbContext comme Singleton

```csharp
// ✅ Dans Program.cs
var mongoSettings = new MongoSettings();
builder.Configuration.GetSection("MongoSettings").Bind(mongoSettings);
builder.Services.AddSingleton(mongoSettings);

// MongoDbContext en Singleton (MongoClient est thread-safe)
builder.Services.AddSingleton<MongoDbContext>();

// Repositories en Scoped
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IWordRepository, WordRepository>();
```

**DON'T DO** : Enregistrer MongoDbContext comme Transient

```csharp
// ❌ À éviter - crée trop de connexions
builder.Services.AddTransient<MongoDbContext>(); // ❌ Inefficace
```

### 2. Configuration dans appsettings.json

**DO** : Externaliser la configuration

```json
{
  "MongoSettings": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "PolyglotteDb",
    "UsersCollectionName": "users",
    "WordsCollectionName": "words"
  }
}
```

**DO** : Utiliser des variables d'environnement pour la production

```json
// appsettings.Docker.json
{
  "MongoSettings": {
    "ConnectionString": "mongodb://mongodb:27017",
    "DatabaseName": "PolyglotteDb"
  }
}
```

## Tests

### 1. Tests d'Intégration avec MongoDB

**DO** : Utiliser un conteneur de test ou une base de test dédiée

```csharp
// ✅ Bon - Test d'intégration
public class UserRepositoryIntegrationTests : IDisposable
{
    private readonly MongoDbContext _context;
    private readonly UserRepository _repository;
    private readonly MongoSettings _settings;

    public UserRepositoryIntegrationTests()
    {
        _settings = new MongoSettings
        {
            ConnectionString = "mongodb://localhost:27017",
            DatabaseName = "PolyglotteDb_Test",
            UsersCollectionName = "users"
        };

        _context = new MongoDbContext(_settings);
        _repository = new UserRepository(_context);
    }

    [Fact]
    public async Task CreateUserAsync_ShouldCreateUser()
    {
        // Arrange
        var user = new User
        {
            Username = "testuser",
            Email = "test@example.com",
            Password = "hashedpassword",
            CreatedAt = DateTime.UtcNow
        };

        // Act
        await _repository.CreateUserAsync(user);

        // Assert
        Assert.NotNull(user.Id);
        var retrievedUser = await _repository.GetUserByIdAsync(user.Id);
        Assert.NotNull(retrievedUser);
        Assert.Equal("testuser", retrievedUser.Username);
    }

    public void Dispose()
    {
        // Nettoyer la base de test
        var client = new MongoClient(_settings.ConnectionString);
        client.DropDatabase(_settings.DatabaseName);
    }
}
```

### 2. Tests Unitaires avec Mock

**DO** : Mocker IMongoCollection pour tests unitaires

```csharp
// ✅ Bon - Test unitaire avec mock
public class UserServiceTests
{
    private readonly Mock<IUserRepository> _mockRepository;
    private readonly UserService _service;

    public UserServiceTests()
    {
        _mockRepository = new Mock<IUserRepository>();
        _service = new UserService(_mockRepository.Object);
    }

    [Fact]
    public async Task GetUserByIdAsync_ShouldReturnUser_WhenUserExists()
    {
        // Arrange
        var userId = ObjectId.GenerateNewId().ToString();
        var expectedUser = new User
        {
            Id = userId,
            Username = "testuser"
        };

        _mockRepository
            .Setup(r => r.GetUserByIdAsync(userId))
            .ReturnsAsync(expectedUser);

        // Act
        var result = await _service.GetUserByIdAsync(userId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(expectedUser.Username, result.Username);
    }
}
```

## Bonnes Pratiques Générales

### 1. Toujours Utiliser Async/Await

**DO** : Opérations MongoDB asynchrones

```csharp
// ✅ Bon
public async Task<IEnumerable<User>> GetAllUsersAsync()
{
    var documents = await _users
        .Find(_ => true)
        .ToListAsync();

    return documents.Select(MapToEntity);
}
```

### 2. Utiliser Projections pour Performance

**DO** : Sélectionner uniquement les champs nécessaires

```csharp
// ✅ Bon - avec projection
public async Task<IEnumerable<string>> GetAllUsernamesAsync()
{
    var projection = Builders<UserDocument>.Projection
        .Include(u => u.Username)
        .Exclude(u => u.Id);

    var documents = await _users
        .Find(_ => true)
        .Project(projection)
        .ToListAsync();

    return documents.Select(d => d["username"].AsString);
}
```

### 3. Utiliser DateTime.UtcNow

**DO** : Toujours utiliser UTC pour les dates

```csharp
// ✅ Bon
public async Task CreateUserAsync(User user)
{
    user.CreatedAt = DateTime.UtcNow; // ✅ UTC
    var userDocument = MapToDocument(user);
    await _users.InsertOneAsync(userDocument);
}
```

**DON'T DO** : Éviter DateTime.Now

```csharp
// ❌ À éviter
user.CreatedAt = DateTime.Now; // ❌ Heure locale
```

## Ressources

- [MongoDB C# Driver Documentation](https://www.mongodb.com/docs/drivers/csharp/)
- [MongoDB Best Practices](https://www.mongodb.com/docs/manual/administration/production-notes/)
- Voir aussi : `.github/instructions/clean-architecture-instructions.md` pour séparation des couches
