# Instructions pour GitHub Copilot et lignes directrices de contribution

Dernière mise à jour: 2025-12-09  
Mainteneur / contact: @B3N0I7

## But

Ce fichier décrit les règles et bonnes pratiques à suivre pour les contributions automatisées et humaines dans ce dépôt monorepo (backend .NET + frontend React/TypeScript). Il s'adresse aux développeurs, aux outils d'aide à la PR (Copilot, bots) et aux reviewers.

## Table des matières

- Scope et portée
- Commandes utiles (PowerShell)
- Principes généraux
  - Backend — C# / .NET
  - Frontend — TypeScript / React / Vite
  - Persistance — MongoDB
- Tests et qualité
- Processus de contribution
- Fichiers d'instructions détaillés

## Scope et portée

S'applique à tous les changements dans le dépôt `PolyglotteProject`. Les contributions automatisées (suggestions Copilot, bots) doivent respecter ces règles. Pour des règles détaillées par module, consultez `.github/instructions/`.

**Important** : Avant toute modification non triviale, consultez `.github/instructions/instruction-relative-aux-questions-de-suivi.md` pour documenter vos hypothèses et poser les questions nécessaires.

## Commandes utiles (PowerShell)

Exécutez ces commandes localement avant d'ouvrir une PR.

- Construire la solution backend :

```powershell
dotnet build "PolyglotteBackend\PolyglotteBackend.sln"
```

- Lancer l'API (développement) :

```powershell
dotnet run --project "PolyglotteBackend\Polyglotte.API\Polyglotte.API.csproj"
```

- Exécuter les tests .NET :

```powershell
dotnet test
```

- Frontend (à la racine de `PolyglotteFrontend`) :

```powershell
npm install
npm run dev
```

## Backend — C# / .NET

### Architecture Clean Architecture

Respectez strictement la séparation des couches :

- **Domain** : entités, value objects, exceptions, interfaces de domaine
- **Application** : services, DTOs, interfaces de services, validations
- **Infrastructure** : implémentations MongoDB, repositories, context
- **API** : contrôleurs, configuration, middlewares

Pour les détails complets : `.github/instructions/clean-architecture-instructions.md`

### Règles essentielles

- **Async/await** : obligatoire pour I/O et appels DB
- **Injection de dépendances** : constructor injection uniquement
- **Principes SOLID** : respecter les 5 principes (détails dans `csharp.instructions.md`)
- **Nullable reference types** : activés dans `.csproj` avec `<Nullable>enable</Nullable>`
- **Logging** : utiliser `ILogger<T>`, jamais `Console.WriteLine`
- **Configuration** : pattern `IOptions<T>` pour accès typé à `appsettings.json`
- **Formattage** : `dotnet format` avant chaque commit

## Frontend — TypeScript / React / Vite

### Règles essentielles

- **TypeScript strict** : typage explicite pour composants, props, hooks
- **Composants fonctionnels** : avec Hooks uniquement (pas de classes)
- **Rules of React** : hooks au niveau supérieur, pas dans conditions/boucles
- **Thinking in React** : décomposition UI, état minimal, props descendantes
- **Variables d'environnement** : via `.env`, ne jamais committer de secrets
- **Optimisations** : `React.memo`, `useMemo`, `useCallback` uniquement quand nécessaire
- **Tests** : Vitest + React Testing Library (pas de tests d'implémentation)
- **Formatage** : ESLint + Prettier, respecter `tsconfig.*.json`

Pour les détails complets : `.github/instructions/react.instructions.md`

## Persistance — MongoDB

### Principes clés

- **Séparation Domain/Infrastructure** : jamais d'`ObjectId` ou attributs MongoDB dans `Domain/`
- **Documents vs Entités** : mapping dans les repositories uniquement
- **Naming** : collections en minuscules pluriel (`users`, `words`), champs en camelCase
- **ObjectId** : toujours valider avec `ObjectId.TryParse` avant utilisation
- **Index** : créer des index pour champs fréquemment requis (username, email)
- **Async** : toutes les opérations MongoDB en async/await
- **DateTime** : utiliser `DateTime.UtcNow` exclusivement
- **MongoDbContext** : enregistré en Singleton, repositories en Scoped

Pour les détails complets : `.github/instructions/mongodb.instructions.md`

## Tests et qualité

### Quality Gates (obligatoire avant PR)

1. **Build** : `dotnet build` (backend) + `npm run build` (frontend)
2. **Format** : `dotnet format` (backend) + `npm run lint` (frontend)
3. **Tests** : `dotnet test` (backend) + `npm test` (frontend)

### Couverture de tests minimale

Chaque modification doit inclure :

- Un test **happy-path** (scénario nominal)
- Un test **edge-case** ou erreur pertinent

### Organisation des tests

- **Backend** : dans projets `*.Tests` correspondants
  - Tests unitaires : Domain, Application (avec mocks)
  - Tests d'intégration : Infrastructure, API (avec base de test)
- **Frontend** : `src/__tests__` ou à côté des composants
  - Tests composants : React Testing Library
  - Tests hooks : `@testing-library/react-hooks`

## Outils recommandés

- Backend : dotnet 8, dotnet format, xUnit, Moq
- Frontend : Node 20+, npm, ESLint, Prettier, Vitest, React Testing Library
- MongoDB : MongoDB C# Driver 2.x+, voir `mongodb.instructions.md`
- Docker : docker-compose pour orchestration locale
- CI : vérifier pipeline pour l'exécution de `dotnet build`, `dotnet test`, `npm install`, `npm test`

## Processus de contribution

### Avant d'implémenter

1. **Questions de suivi** : pour modifications non triviales, consultez `.github/instructions/instruction-relative-aux-questions-de-suivi.md`
2. **Documenter les hypothèses** : inclure estimation de confiance et hypothèses dans la PR
3. **Vérifier les instructions** : consulter fichiers spécifiques dans `.github/instructions/`

### Bonnes pratiques Copilot

**DO** :

- Fournir un bref contexte du snippet proposé
- Inclure tests unitaires pertinents
- Préférer solutions simples et idiomatiques
- Respecter les principes SOLID et Clean Architecture
- Documenter les décisions techniques

**DON'T** :

- ❌ Ajouter des secrets en clair
- ❌ Modifier `appsettings*.json` avec credentials
- ❌ Supprimer des fichiers projet sans justification
- ❌ Exposer types MongoDB (`ObjectId`) dans Domain
- ❌ Utiliser `Console.WriteLine` au lieu de `ILogger<T>`

### En cas d'incertitude

Demander confirmation au développeur plutôt que de deviner.

## Fichiers d'instructions détaillés

Consultez `.github/instructions/` pour règles complètes :

| Fichier                                          | Scope                               | Description                                          |
| ------------------------------------------------ | ----------------------------------- | ---------------------------------------------------- |
| `clean-architecture-instructions.md`             | `**/*.cs`                           | Structure Clean Architecture, séparation des couches |
| `csharp.instructions.md`                         | `**/*.cs`                           | Conventions C#, SOLID, async/await, DI, tests        |
| `react.instructions.md`                          | `PolyglotteFrontend/**`             | Rules of React, Hooks, TypeScript, optimisations     |
| `mongodb.instructions.md`                        | `Polyglotte.Infrastructure/**/*.cs` | MongoDB patterns, indexation, mapping                |
| `instruction-relative-aux-questions-de-suivi.md` | Tous                                | Processus clarification avant implémentation         |
