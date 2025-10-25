# Polyglotte — Monorepo

Description
-----------
Polyglotte est un monorepo contenant une API backend en C# (.NET) et un frontend React + TypeScript (Vite).

À propos de l'application
------------------------
Ce projet implémente une application d'apprentissage de vocabulaire destinée aux apprenants de langues. Pour commencer, l'application propose des paires français ↔ anglais (deux sens : français -> anglais et anglais -> français). L'objectif est de fournir des fonctionnalités simples et extensibles :

- Révision de mots par cartes (flashcards) et listes de vocabulaire.
- Modes d'entraînement (révision espacée, quiz, lecture/écriture).
- Sauvegarde des progrès côté backend et synchronisation entre appareils.

Le projet est conçu pour être extensible : d'autres langues, jeux d'exercices et améliorations de l'UX peuvent être ajoutés ultérieurement.

Structure principale
-------------------
- `PolyglotteBackend/` — Backend .NET (solution `Polyglotte.sln`). L'API se trouve dans `Polyglotte.API/`.
- `PolyglotteFrontend/` — Frontend React + TypeScript (Vite).
- `.github/` — Directives et instructions pour Copilot et CI (ex: `copilot-instructions.md`).

Commandes utiles (PowerShell)
-----------------------------
# Backend
dotnet build "PolyglotteBackend\Polyglotte.sln"
dotnet run --project "PolyglotteBackend\Polyglotte.API\Polyglotte.API.csproj"
dotnet test

# Frontend (depuis le dossier `PolyglotteFrontend`)
cd PolyglotteFrontend
npm install
npm run dev

Conventions et bonnes pratiques
-----------------------------
- Backend (.NET)
  - Préférer `async/await` pour I/O et appels réseau.
  - Respecter la séparation Domaine / Application / Infrastructure :
    - `Polyglotte.Domain/` pour entités et value objects.
    - `Polyglotte.Application/Features` pour handlers et cas d'usage.
    - `Polyglotte.Infrastructure/` pour la persistance et implémentations concrètes.
  - Ne pas committer de secrets (utiliser des variables d'environnement).

- Frontend (React + TypeScript)
  - Utiliser TypeScript strict quand possible.
  - Préférer des composants fonctionnels et hooks.
  - Gérer les variables d'environnement via `.env` (ne pas committer les `.env.local`).

Tests
-----
- Backend : utiliser `dotnet test` (xUnit recommandé si indéterminé).
- Frontend : exécuter la suite de tests avec la commande configurée dans `package.json` (par ex. `npm test` ou `npm run test`).

Contributions
-------------
Merci de respecter les conventions du projet. Voir `.github/copilot-instructions.md` pour des directives détaillées destinées à Copilot et aux contributeurs (en français).

Fichiers importants
-------------------
- `PolyglotteBackend/Polyglotte.API/Program.cs` — point d'entrée de l'API.
- `PolyglotteFrontend/src/main.tsx` — point d'entrée du frontend.
- `.gitignore` à la racine — règles pour .NET, Node, IDEs et fichiers temporaires.

Contact
-------
Ouvrez une issue ou créez une PR si vous souhaitez proposer des modifications ou avez des questions.
