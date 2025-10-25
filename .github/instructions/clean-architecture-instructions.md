---
applyTo: '**/*.cs'
---

# Architecture Propre

Lors de la mise en œuvre de services backend, suivez ces principes d'Architecture Propre pour garantir la maintenabilité, l'évolutivité et la séparation des préoccupations.

## Structure

1. Organisez le projet en les couches suivantes :
   - **Domaine** : Contient la logique métier essentielle, les `entities`, les objets de valeur et les événements de domaine.
   - **Application** : Contient les cas d'utilisation, les commandes, les requêtes et les interfaces pour les services externes.
   - **Infrastructure** : Contient les implémentations pour les services externes, l'accès à la base de données et les intégrations tierces.
   - **Api** : Contient les points de terminaison API, les contrôleurs et les modèles de requête/réponse.

2. Chaque couche ne doit dépendre que des couches en dessous d'elle :
   - **Domaine** n'a pas de dépendances.
   - **Application** dépend uniquement de **Domaine**.
   - **Infrastructure** dépend de **Application** et **Domaine**.
   - **Api** dépend de **Application** et **Infrastructure**.

## Mise en œuvre

1. **Couche Domaine** :
   - Définir des entités avec des règles métier et une logique de validation.
   - Utiliser des objets de valeur pour les types de données immuables.
   - Élever des événements de domaine pour des actions commerciales significatives.

2. **Couche Application** :
   - Définir des services pour gérer les commandes et les requêtes (par exemple, `IUserService`, `IOrderService`).
   - Implémenter des commandes et des requêtes sous forme de méthodes dans ces services.
   - Définir des interfaces pour les dépendances externes (par exemple, les dépôts, les services).
   - Implémenter la logique de validation à l'aide de FluentValidation.

3. **Couche Infrastructure** :
   - Implémenter les interfaces définies dans la couche **Application**.
   - Utiliser l'injection de dépendance pour enregistrer les implémentations.
   - Garder la logique d'accès à la base de données dans les dépôts.

4. **Couche Api** :
   - Utiliser des points de terminaison API pour gérer les requêtes et réponses HTTP.
   - Mapper les modèles de requête aux méthodes de service et les modèles de réponse aux réponses API.
   - Éviter la logique métier dans cette couche.

## Exemple de Structure de Répertoire

Voici un exemple de structure de répertoire pour un projet C# suivant les principes de l'Architecture Propre :
```
[project].sln
[project]Backend/
    [project].Domaine/
        Abstractions/
        DomainEvents/
        Entities/
            User.cs
            Vocabulary.cs
        Exceptions
        ObjetsValeur/
        ValuObjects/
    [project].Application/
        Abstractions/
            Persistence/
            Services/
        Common/
            Behaviors/
            Mappings/
        Features/
            User/
                Commands/
                Dtos/
                Queries/
                Validators/
            Vocabulary/
                Commands/
                Dtos/
                Queries/
                Validators/
    [project].Infrastructure/
        Authentication/
            JwtTokenService/
            Policies/
        Observability/
            OpenTelemetry/
            Serilog/
        Persistence/
            Mongo/
                Indexes/
                Migrations/
                MongoContext/
                MongoDbOptions/
                Repositories/
        Services/
    [project].API/
        Configuration/
            Cors/
            HealthChecks/
            Swagger/
        Controllers/
            UserController.cs
            VocabularyController.cs
        Middlewares/
```
## Directives Supplémentaires

1. Utilisez l'injection de dépendance pour gérer les dépendances entre les couches.
2. Évitez les dépendances circulaires entre les couches.
3. Écrivez des tests unitaires pour les couches **Domaine** et **Application**.
4. Utilisez des tests d'intégration pour les couches **Infrastructure** et **Api**.
5. Suivez les principes SOLID dans chaque couche.
6. Évitez d'utiliser une bibliothèque de médiation ; appelez directement les méthodes de service depuis la couche **Api**.