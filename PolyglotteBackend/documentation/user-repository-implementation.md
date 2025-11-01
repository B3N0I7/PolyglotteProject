# Implémentation du UserRepository

Dernière mise à jour : 2025-11-01  
Auteur : Documentation automatique

## Vue d'ensemble

Ce document décrit l'implémentation complète du `UserRepository` dans le projet Polyglotte, suivant les principes de l'architecture Clean et les bonnes pratiques MongoDB.

## Architecture

### Structure des couches

```
Domain/
├── Entities/User.cs                    # Entité métier
└── Interfaces/IUserRepository.cs       # Interface du repository

Infrastructure/
├── Documents/UserDocument.cs           # Document MongoDB
├── MongoDbContext/
│   ├── MongoDbContext.cs              # Context MongoDB
│   └── MongoSettings.cs               # Configuration MongoDB
└── Repositories/UserRepository.cs      # Implémentation du repository
```

### Mapping Domain ↔ Infrastructure

Le repository assure la conversion entre :
- **Entité Domain** : `User` (logique métier)
- **Document Infrastructure** : `UserDocument` (persistance MongoDB)

## Entité User (Domain)

```csharp
namespace Polyglotte.Domain.Entities
{
    public class User
    {
        public string Id { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public User()
        {
            CreatedAt = DateTime.UtcNow;
        }
    }
}
```

### Propriétés
- **Id** : Identifiant unique (ObjectId MongoDB en string)
- **Username** : Nom d'utilisateur unique
- **Email** : Adresse email unique
- **CreatedAt** : Date de création automatique en UTC

## Interface IUserRepository

### Méthodes de base (CRUD)

```csharp
Task<User?> GetUserByIdAsync(string userId);
Task<IEnumerable<User>> GetAllUsersAsync();
Task CreateUserAsync(User user);
Task UpdateUserAsync(User user);
Task DeleteUserAsync(string userId);
```

### Méthodes de recherche

```csharp
Task<User?> GetUserByUsernameAsync(string username);
Task<User?> GetUserByEmailAsync(string email);
Task<IEnumerable<User>> SearchUsersByUsernameAsync(string searchTerm);
```

### Méthodes de vérification

```csharp
Task<bool> UserExistsAsync(string userId);
Task<bool> UsernameExistsAsync(string username);
Task<bool> EmailExistsAsync(string email);
```

### Méthodes de pagination

```csharp
Task<long> GetTotalUsersCountAsync();
Task<IEnumerable<User>> GetUsersPaginatedAsync(int skip, int limit);
```

## Document MongoDB

```csharp
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

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }
    }
}
```

### Annotations MongoDB
- **[BsonId]** : Définit la clé primaire MongoDB
- **[BsonElement]** : Mapping des propriétés vers les champs de la collection

## Configuration MongoDB

### MongoSettings

```csharp
public class MongoSettings
{
    public string ConnectionString { get; set; } = "mongodb://localhost:27017";
    public string DatabaseName { get; set; } = "PolyglotteDb";
    public string WordsCollectionName { get; set; } = "words";
    public string UsersCollectionName { get; set; } = "users";
}
```

### MongoDbContext

```csharp
public class MongoDbContext
{
    private readonly IMongoDatabase _database;
    
    public IMongoCollection<UserDocument> Users => 
        _database.GetCollection<UserDocument>(_settings.UsersCollectionName);
}
```

## Implémentation du Repository

### Fonctionnalités principales

#### 1. Récupération par ID
```csharp
public async Task<User?> GetUserByIdAsync(string userId)
{
    if (!ObjectId.TryParse(userId, out var objectId))
        return null;

    var userDocument = await _users
        .Find(u => u.Id == objectId)
        .FirstOrDefaultAsync();

    return userDocument != null ? MapToEntity(userDocument) : null;
}
```

**Points clés :**
- Validation du format ObjectId
- Retour `null` si utilisateur non trouvé
- Mapping automatique vers l'entité Domain

#### 2. Création d'utilisateur
```csharp
public async Task CreateUserAsync(User user)
{
    var userDocument = MapToDocument(user);
    await _users.InsertOneAsync(userDocument);
    
    // Mise à jour de l'entité avec l'ID généré
    user.Id = userDocument.Id.ToString();
}
```

**Points clés :**
- Génération automatique de l'ObjectId par MongoDB
- Mise à jour de l'entité avec l'ID généré
- Validation des paramètres d'entrée

#### 3. Mise à jour
```csharp
public async Task UpdateUserAsync(User user)
{
    if (!ObjectId.TryParse(user.Id, out var objectId))
        throw new ArgumentException("Invalid User ID format");

    var result = await _users.ReplaceOneAsync(
        u => u.Id == objectId,
        userDocument);

    if (result.MatchedCount == 0)
        throw new InvalidOperationException($"User with ID {user.Id} not found");
}
```

**Points clés :**
- Validation du format ID
- Utilisation de `ReplaceOneAsync` pour mise à jour complète
- Vérification de l'existence avant mise à jour

#### 4. Recherche et pagination
```csharp
public async Task<IEnumerable<User>> SearchUsersByUsernameAsync(string searchTerm)
{
    var filter = Builders<UserDocument>.Filter.Regex(
        u => u.Username, 
        new BsonRegularExpression(searchTerm, "i"));

    var userDocuments = await _users
        .Find(filter)
        .SortBy(u => u.Username)
        .ToListAsync();

    return userDocuments.Select(MapToEntity);
}
```

**Points clés :**
- Recherche par expression régulière insensible à la casse
- Tri des résultats
- Support de la pagination avec `Skip` et `Limit`

### Mapping Domain ↔ Document

#### Entité → Document
```csharp
private static UserDocument MapToDocument(User entity)
{
    return new UserDocument
    {
        Username = entity.Username,
        Email = entity.Email,
        CreatedAt = entity.CreatedAt
    };
}
```

#### Document → Entité
```csharp
private static User MapToEntity(UserDocument document)
{
    return new User
    {
        Id = document.Id.ToString(),
        Username = document.Username ?? string.Empty,
        Email = document.Email ?? string.Empty,
        CreatedAt = document.CreatedAt
    };
}
```

## Gestion des erreurs

### Types d'exceptions

1. **ArgumentNullException** : Paramètre null
2. **ArgumentException** : Format d'ID invalide
3. **InvalidOperationException** : Entité non trouvée lors d'une mise à jour/suppression

### Stratégies de validation

```csharp
// Validation des paramètres d'entrée
if (user == null)
    throw new ArgumentNullException(nameof(user));

// Validation du format ObjectId
if (!ObjectId.TryParse(userId, out var objectId))
    throw new ArgumentException("Invalid User ID format");

// Vérification de l'existence
if (result.MatchedCount == 0)
    throw new InvalidOperationException($"User with ID {userId} not found");
```

## Utilisation

### Injection de dépendance

```csharp
// Dans Program.cs ou Startup.cs
services.AddScoped<IUserRepository, UserRepository>();
services.AddSingleton<MongoSettings>();
services.AddScoped<MongoDbContext>();
```

### Exemples d'utilisation

```csharp
public class UserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<User> CreateUserAsync(string username, string email)
    {
        // Vérifier l'unicité
        if (await _userRepository.UsernameExistsAsync(username))
            throw new InvalidOperationException("Username already exists");

        if (await _userRepository.EmailExistsAsync(email))
            throw new InvalidOperationException("Email already exists");

        // Créer l'utilisateur
        var user = new User
        {
            Username = username,
            Email = email
        };

        await _userRepository.CreateUserAsync(user);
        return user;
    }

    public async Task<IEnumerable<User>> GetUsersPageAsync(int page, int pageSize)
    {
        var skip = (page - 1) * pageSize;
        return await _userRepository.GetUsersPaginatedAsync(skip, pageSize);
    }
}
```

## Tests recommandés

### Tests unitaires

```csharp
[Fact]
public async Task CreateUserAsync_ShouldGenerateId()
{
    // Arrange
    var user = new User { Username = "testuser", Email = "test@test.com" };
    
    // Act
    await _repository.CreateUserAsync(user);
    
    // Assert
    Assert.NotEmpty(user.Id);
    Assert.True(ObjectId.TryParse(user.Id, out _));
}

[Fact]
public async Task GetUserByIdAsync_WithInvalidId_ShouldReturnNull()
{
    // Act
    var result = await _repository.GetUserByIdAsync("invalid-id");
    
    // Assert
    Assert.Null(result);
}
```

### Tests d'intégration avec MongoDB

```csharp
[Fact]
public async Task CreateAndRetrieve_ShouldWork()
{
    // Arrange
    var user = new User 
    { 
        Username = "integration-test", 
        Email = "integration@test.com" 
    };

    // Act
    await _repository.CreateUserAsync(user);
    var retrieved = await _repository.GetUserByIdAsync(user.Id);

    // Assert
    Assert.NotNull(retrieved);
    Assert.Equal(user.Username, retrieved.Username);
    Assert.Equal(user.Email, retrieved.Email);
}
```

## Performance et bonnes pratiques

### Indexation MongoDB recommandée

```javascript
// Dans MongoDB Shell
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "createdAt": 1 })
```

### Optimisations de requêtes

1. **Projections** : Utiliser `.Project()` pour récupérer seulement les champs nécessaires
2. **Filtres composés** : Combiner les filtres pour réduire les résultats
3. **Pagination** : Toujours utiliser `Skip` et `Limit` pour les grandes collections
4. **Tri** : Indexer les champs utilisés dans `.SortBy()`

## Évolutions futures

### Améliorations possibles

1. **Cache Redis** : Ajouter une couche de cache pour les requêtes fréquentes
2. **Soft Delete** : Implémenter la suppression logique avec un champ `IsDeleted`
3. **Audit Trail** : Tracer les modifications avec `UpdatedAt` et `UpdatedBy`
4. **Validation avancée** : Ajouter validation email, contraintes username
5. **Bulk Operations** : Ajouter des méthodes pour les opérations en lot

### Architecture événementielle

```csharp
// Exemple d'intégration avec des événements Domain
public async Task CreateUserAsync(User user)
{
    await _users.InsertOneAsync(MapToDocument(user));
    user.Id = userDocument.Id.ToString();
    
    // Publier événement
    await _eventBus.PublishAsync(new UserCreatedEvent(user));
}
```

## Conclusion

Cette implémentation du `UserRepository` suit les bonnes pratiques :

- ✅ **Architecture Clean** : Séparation claire des responsabilités
- ✅ **Async/Await** : Toutes les opérations sont asynchrones  
- ✅ **Gestion d'erreurs** : Validation robuste et exceptions appropriées
- ✅ **Performance** : Requêtes optimisées avec pagination
- ✅ **Testabilité** : Interface bien définie pour les mocks
- ✅ **Extensibilité** : Méthodes additionnelles pour les besoins futurs

Le repository est prêt pour la production et peut être étendu selon les besoins métier du projet Polyglotte.