# Organisation des Services et Types relatifs aux Mots

## Architecture Implémentée

### 📁 Structure

```
features/
├── words/                          # 🆕 DOMAINE PARTAGÉ (shared domain)
│   ├── index.tsx                   # Exports centralisés
│   ├── types/
│   │   ├── word.ts                 # Word, CreateWordRequest, UpdateWordRequest, DeleteWordRequest
│   │   ├── wordErrors.ts           # Erreurs communes
│   │   └── index.ts
│   ├── services/
│   │   ├── wordApiService.ts       # Service API pur (CRUD basique)
│   │   └── index.ts
│   └── validators/
│       ├── wordValidator.ts        # Validation réutilisable
│       └── index.ts
│
├── addWord/                        # Feature : Ajout
│   ├── types/
│   │   └── addWordRequest.ts       # Types UI uniquement (formulaire)
│   └── services/
│       └── addWordService.ts       # Utilise wordApiService + wordValidator
│
├── updateWord/                     # Feature : Modification
│   ├── types/
│   │   └── updateWordRequest.ts    # Types UI uniquement (formulaire)
│   └── services/
│       └── updateWordService.ts    # Utilise wordApiService + wordValidator
│
├── deleteWord/                     # Feature : Suppression
│   ├── types/
│   │   └── deleteWordRequest.ts    # Types UI uniquement (confirmation)
│   └── services/
│       └── deleteWordService.ts    # Utilise wordApiService
│
└── displayWords/                   # Feature : Affichage
    ├── types/
    │   └── word.ts                 # Ré-exporte Word pour compatibilité
    └── services/
        └── wordService.ts          # Wrapper @deprecated vers wordApiService
```

## 🎯 Principes de l'Architecture

### 1. Séparation Domain / Features

- **`words/`** : Domaine partagé contenant les concepts métier de base
  - Types fondamentaux (Word, requests)
  - Service API pur (CRUD sans logique métier)
  - Validateurs réutilisables

- **Features** : Modules spécialisés avec logique métier spécifique
  - Types UI (formulaires, props)
  - Services métier (validation, doublons, etc.)
  - Composants et hooks

### 2. Flux de Dépendances

```
┌─────────────┐
│   words/    │  ← Domaine partagé (pas de dépendances aux features)
└──────┬──────┘
       │
       ↓ (import)
┌──────────────────────────────────────┐
│ addWord | updateWord | deleteWord |  │  ← Features (dépendent de words/)
│         displayWords                 │
└────────────────────────────────────────┘
```

**Règle** : Features → words/ (jamais l'inverse)

### 3. Responsabilités

#### `words/services/wordApiService.ts`

✅ Appels HTTP purs
✅ Gestion basique des erreurs API
❌ Logique métier
❌ Validation

#### Features `services/`

✅ Validation des données
✅ Logique métier (vérification doublons, etc.)
✅ Orchestration
✅ Utilise wordApiService

## 📝 Guide d'Utilisation

### Importer le type Word

```typescript
// ✅ Recommandé
import type { Word } from "../../words/types";

// ⚠️ Déprécié (mais fonctionne pour compatibilité)
import type { Word } from "../../displayWords/types";
```

### Utiliser le service API

```typescript
// ✅ Direct depuis wordApiService
import { wordApiService } from "../../words/services";

const words = await wordApiService.getAll();
const word = await wordApiService.getById(id);
await wordApiService.create({ userId, frenchWord, englishWord });
await wordApiService.update(id, userId, { frenchWord, englishWord });
await wordApiService.delete(id);
```

### Validation

```typescript
// ✅ Utiliser le validateur centralisé
import { wordValidator } from "../../words/validators";

const errors = wordValidator.validateWordFields(frenchWord, englishWord);
if (errors) {
  // Gérer les erreurs
}
```

### Service métier feature

```typescript
// ✅ Exemple dans addWordService
import { wordApiService } from "../../words/services";
import { wordValidator } from "../../words/validators";

export const addWordService = {
  validateWordData(formData) {
    return wordValidator.validateWordFields(
      formData.frenchWord,
      formData.englishWord
    );
  },

  async createWord(userId, wordData) {
    return await wordApiService.create({
      userId,
      frenchWord: wordData.frenchWord.trim(),
      englishWord: wordData.englishWord.trim(),
    });
  },
};
```

## ✅ Avantages

| Avant                             | Après                                |
| --------------------------------- | ------------------------------------ |
| ❌ Types dupliqués (3 endroits)   | ✅ Types centralisés dans `words/`   |
| ❌ Dépendances circulaires        | ✅ Dépendances unidirectionnelles    |
| ❌ Service API + logique mélangés | ✅ Service API isolé                 |
| ❌ Validation dupliquée           | ✅ Validateur réutilisable           |
| ❌ Responsabilités floues         | ✅ Séparation claire Domain/Features |

## 🔄 Migration Progressive

### Compatibilité Rétroactive

Pour faciliter la migration, `displayWords/types/word.ts` ré-exporte `Word` :

```typescript
export type { Word } from "../../words/types";
```

Cela permet aux anciens imports de continuer à fonctionner.

### Dépréciation

`displayWords/services/wordService.ts` est marqué `@deprecated` et délègue à `wordApiService`.

## 🚀 Prochaines Étapes (Optionnel)

1. **Supprimer les wrappers dépréciés** une fois tous les imports migrés
2. **Ajouter des types UI avancés** dans `displayWords/types/` (filtres, tri, pagination)
3. **Créer des hooks réutilisables** dans `words/hooks/` si nécessaire
4. **Tests unitaires** pour `wordValidator` et `wordApiService`

---

**Dernière mise à jour** : 2025-11-22  
**Auteur** : Architecture proposée et implémentée par GitHub Copilot
