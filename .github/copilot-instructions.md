# Instructions pour GitHub Copilot / Guidelines de contribution

# Instructions Copilot

**Avant tout développement ou génération de code, lisez systématiquement tous les fichiers d'instructions dans « .github/instructions/ ».** Ceci est obligatoire pour garantir que toutes les règles du projet sont chargées et appliquées correctement.

Langue: Français

Merci de contribuer au dépôt Polyglotte. Ce fichier donne des consignes précises destinées à GitHub Copilot (et utiles aux développeurs humains) pour générer des suggestions pertinentes et respecter les conventions du projet.

## Contexte du projet
- Monorepo avec deux parties principales:
  - `PolyglotteBackend/` : backend en C# (.NET) - solution `Polyglotte.sln`, API dans `Polyglotte.API`.
  - `PolyglotteFrontend/` : frontend React + TypeScript avec Vite.

## Objectifs généraux
- Générer du code lisible, testé et maintenable.
- Respecter le style idiomatique de chaque techno (C# pour le backend, TypeScript/React pour le frontend).
- Ne pas exposer ou modifier de secrets/credentials.

## Commandes utiles (PowerShell)
- Construire la solution backend :
```
dotnet build "PolyglotteBackend\Polyglotte.sln"
```
- Lancer l'API :
```
dotnet run --project "PolyglotteBackend\Polyglotte.API\Polyglotte.API.csproj"
```
- Frontend (à la racine de `PolyglotteFrontend`):
```
npm install
npm run dev
```
- Exécuter les tests .NET (si présents) :
```
dotnet test
```

## Règles et préférences (par techno)

### Backend — C# / .NET
- Préférer des méthodes asynchrones `async/await` pour I/O et appels DB.
- Utiliser l'injection de dépendances et abstractions dans `Abstractions/Services`.
- Respecter la séparation domaine/application/infrastructure :
  - Domaine (entités, value objects, exceptions) dans `Polyglotte.Domain/`
  - Cas d'utilisation / handlers dans `Polyglotte.Application/Features`
  - Persistance/implémentations dans `Polyglotte.Infrastructure/`
- Préserver les fichiers de configuration commités (p.ex. `appsettings.json`). Ne pas proposer de modifications qui ajoutent des secrets en clair.
- Lorsqu'on modifie des signatures publiques (API), générer aussi des migrations/contrats et mettre à jour la doc si nécessaire.

### Frontend — TypeScript / React / Vite
- Utiliser TypeScript strict quand possible et typer les composants/props.
- Préférer des composants fonctionnels avec hooks.
- Gérer les variables d'environnement via `.env` et ne pas proposer d'insertions de secrets.

## Tests unitaireset qualité
- Lors de suggestions de code, générer aussi un test unitaire minimal (si pertinent) :
  - Pour C# : xUnit et Moq et System.Text.Assertions et System.Text.Json si besoin.
  - Pour TS : Vitest et React Testing Library.
- Fournir des tests pour le happy-path et au moins un cas d'erreur/limite.

## Sécurité et secrets
- Ne jamais ajouter de clés, mots de passe, tokens ou certificats en clair dans le code.
- Proposer l'usage de variables d'environnement ou du Key Vault (si mentionné).

## Conventions de commit
- Structure des messages de commit :
-   Type d'action (feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert)
-   Portée optionnelle entre parenthèses (module, feature)
-   Deux-points et description concise (impératif, 50 caractères max)
- `!` pour les commits de breaking change.
- Exemples : 
  - `feat(auth): ajouter la gestion OAuth2`
  - `fix(deck): corriger le bug de création de deck`
  - `refactor(user): simplifier la logique de validation`

## Bonnes pratiques pour les suggestions Copilot
- Do :
  - Expliquer brièvement le but du snippet proposé.
  - Fournir une alternative concise si la première solution a des limites.
  - Inclure des tests quand c'est simple et pertinent.

- Don't :
  - Ne pas modifier `appsettings*.json` pour ajouter des secrets.
  - Ne pas supprimer ou ignorer des fichiers projet importants sans justification.

## Où créer les modifications
- Backend : créer les classes/handlers dans `Polyglotte.Application/Features` ou `Polyglotte.Infrastructure/` selon la responsabilité.
- Domaine : extensions dans `Polyglotte.Domain/` (ValueObjects, Entities).
- Frontend : composants dans `PolyglotteFrontend/src/features` ou `shared` si réutilisable.

## Exemple succinct de demande pour Copilot
"Ajoute un handler MediatR C# pour créer un Deck dans `Polyglotte.Application`, avec validation, mapping vers l'entité domaine et un test xUnit minimal." — Attendu : handler, DTO, mapping et test.

---
Si vous voulez que j'ajuste le ton (plus strict sur le style) ou que j'ajoute des commandes CI spécifiques (GitHub Actions) dans `.github/workflows`, dites-le et je générerai le fichier correspondant.
