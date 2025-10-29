# Instructions pour GitHub Copilot et lignes directrices de contribution

Dernière mise à jour: 2025-10-27  
Mainteneur / contact: @B3N0I7

## But

Ce fichier décrit les règles et bonnes pratiques à suivre pour les contributions automatisées et humaines dans ce dépôt monorepo (backend .NET + frontend React/TypeScript). Il s'adresse aux développeurs, aux outils d'aide à la PR (Copilot, bots) et aux reviewers.

## Table des matières

- Scope et portée
- Commandes utiles (PowerShell)
- Principes généraux par techno
  - Backend — C# / .NET
  - Frontend — TypeScript / React / Vite
- Tests et qualité
- Sécurité et gestion des secrets
- Conventions de commit
- PR / revue et CI
- Ressources et fichiers liés

## Scope et portée

S'applique à tous les changements dans le dépôt `PolyglotteProject`. Les contributions automatisées (suggestions Copilot, bots) doivent respecter ces règles. Pour des règles détaillées par module, consultez `.github/instructions/`.

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

## Backend — C# / .NET (règles)

- Préférer méthodes asynchrones (`async`/`await`) pour I/O et appels DB.
- Utiliser l'injection de dépendances du conteneur .NET (constructor injection).
- Respecter la séparation Domain / Application / Infrastructure / Presentation :
  - `Polyglotte.Domain/` : entités, value objects, exceptions.
  - `Polyglotte.Application/` : cas d'utilisation, DTOs, interfaces de services.
  - `Polyglotte.Infrastructure/` : implémentations de persistance (Mongo), migrations, context.
  - `Polyglotte.API/` : contrôleurs, wiring, configuration.
- Tests unitaires : xUnit + Moq. Pour la sérialisation ou assertions spécifiques, utiliser `System.Text.Json` et outils d'assertion .NET standards.
- Formattage : `dotnet format` recommandé avant commit.

## Frontend — TypeScript / React / Vite (règles)

- TypeScript strict ; typer composants et props.
- Composants fonctionnels et Hooks.
- Variables d'environnement via `.env` (ne pas committer secrets).
- Tests : Vitest + React Testing Library pour composants UI.
- Linter / Formatter : ESLint + Prettier. Présentation : respecter `tsconfig.*.json` présents.

## Tests et qualité

- Exiger que toute PR passe localement les étapes : Build → Lint → Tests.
- Quality gates minimal :
  - Build: `dotnet build` pour backend, `npm run build` pour frontend si applicable.
  - Lint / Format: `dotnet format` et `npm run lint`.
  - Tests unitaires : `dotnet test`, `npm test` ou `npm run test`.
- Ajouter au moins :
  - Un test happy-path.
  - Un test d'erreur/limite pertinent.
- Place des tests :
  - Backend : dans le projet de test correspondant (créer `*.Tests` si nécessaire).
  - Frontend : `src/__tests__` ou à côté des composants.

## Sécurité et secrets

- Ne jamais ajouter de clés, mots de passe, tokens ou certificats en clair.
- Utiliser variables d'environnement ou secret store (Azure Key Vault, GitHub Secrets).
- Si une nouvelle configuration sécurisée est nécessaire, documenter la procédure d'accès dans `documentation/` (sans exposer les secrets).
- Avant tout commit, vérifier `git diff` pour éviter inclusion accidentelle.

## Conventions de commit

Format recommandé :

- type(scope): description
- type ∈ {feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert}
- Exemple : `feat(auth): ajouter la gestion OAuth2`
- Exemple : `fix(deck): corriger le bug de création de deck`
- Utiliser `!` pour breaking change : `refactor(api)!: changement breaking...`

## PR / revue et CI

- PR doit contenir :
  - Titre clair, description courte, ticket associé (si existant).
  - Checklist : Build, Lint, Tests (statuts CI green).
  - Liste des fichiers modifiés et justification si changement d'API publique.
- Etiquettes et reviewers : suivre la politique du repo (assigner au mainteneur si incertain).
- Pour modifications d'API publique, documenter le contrat et notifier consommateurs.

## Outils recommandés

- Backend : dotnet 7/8 (selon CI), dotnet format, xUnit, Moq.
- Frontend : Node 18+, npm, ESLint, Prettier, Vitest, React Testing Library.
- CI : vérifier pipeline pour l'exécution de `dotnet build`, `dotnet test`, `npm install`, `npm test`.

## Bonnes pratiques pour Copilot / suggestions automatiques

- Do :
  - Fournir un bref but du snippet proposé.
  - Inclure tests unitaires minimal quand c'est pertinent.
  - Préférer solutions simples et idiomatiques.
- Don't :
  - Ne pas ajouter de secrets en clair.
  - Ne pas modifier `appsettings*.json` pour y insérer des credentials.
  - Ne pas supprimer des fichiers projet sans justification.
- Si incertitude fonctionnelle : créer une issue ou demander un reviewer humain.

## Autres fichiers d'instructions

Consultez le répertoire `.github/instructions/` pour règles additionnelles (ex : `clean-architecture-instructions.md`, `instruction-relative-aux-questions-de-suivi.md`)

## Notes finales

- Ces règles sont vivantes — mettez à jour la section "Dernière mise à jour" quand vous changez ce fichier.
- Si vous voulez que j'applique ces changements dans le dépôt, dites-le et je fournis un patch/commit recommandé.
