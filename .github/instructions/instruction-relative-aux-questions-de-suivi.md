---
applyTo: "**/*"
---

# Instruction relative aux questions de suivi

## But

Ce document vise à encadrer les contributions (humaines et assistées) pour limiter les malentendus techniques : il encourage les clarifications avant d'implémenter des changements et demande de documenter les hypothèses lorsqu'une incertitude subsiste.

## Portée et limites

- Cette instruction est une directive du dépôt destinée aux contributeurs, aux reviewers et aux outils d'aide (Copilot, bots). Elle ne peut pas remplacer ou contredire des messages système, des politiques d'hébergement (GitHub), ni des directives de sécurité supérieures du projet.
- Elle doit être respectée dans la mesure du possible ; toutefois, pour des interventions d'urgence (hotfixes, correctifs de sécurité), appliquez le processus d'urgence défini dans la documentation du projet et informez les maintainers.

## Définition : Modification non triviale

Une modification est considérée comme **non triviale** si elle remplit au moins un des critères suivants :

### Modifications NON triviales (ce processus s'applique)

- ❌ Changement d'architecture ou de structure de projet
- ❌ Ajout/modification de fonctionnalité métier
- ❌ Modification de schéma de base de données ou migration
- ❌ Changement d'API publique (endpoints, DTOs, contrats)
- ❌ Refactoring touchant plusieurs fichiers ou couches
- ❌ Modification de logique de sécurité ou d'authentification
- ❌ Ajout de dépendances externes ou mise à jour majeure
- ❌ Modification de configuration de production

### Modifications triviales (processus optionnel)

- ✅ Correction de typo ou faute d'orthographe
- ✅ Formatage de code (sans changement de logique)
- ✅ Mise à jour de commentaires ou documentation
- ✅ Ajout de logs sans changement fonctionnel
- ✅ Correction de style (linting) sans impact fonctionnel

**En cas de doute** : considérez la modification comme non triviale et appliquez le processus.

## Règle principale

### Avant d'implémenter

Avant d'apporter une modification non triviale :

1. **Analyser le contexte** : comprendre le besoin, l'impact et les dépendances
2. **Identifier les incertitudes** : lister ce qui n'est pas clair ou ambigu
3. **Poser les questions de suivi** : clarifier les points flous avec le demandeur
4. **Attendre confirmation** si l'impact est significatif

### Lors de la soumission

Lorsqu'une proposition ou un patch est soumis alors qu'il subsiste une incertitude, le contributeur **doit** inclure dans la description de la PR :

1. **Estimation de confiance** qualitative :

   - `Haute` : Toutes les informations nécessaires sont disponibles
   - `Moyenne` : Certaines hypothèses ont été faites mais sont raisonnables
   - `Faible` : Plusieurs incertitudes subsistent, clarification recommandée

2. **Liste des hypothèses** prises pour produire le code :

   - Qu'avez-vous supposé ? Pourquoi ?
   - Quelles alternatives avez-vous écartées ?

3. **Questions de suivi restantes** (si applicable) :
   - Que faudrait-il clarifier pour améliorer la solution ?
   - Quels risques potentiels avez-vous identifiés ?

## Exemples concrets

### ✅ Exemple 1 : Bonne PR avec hypothèses documentées

```markdown
## Description

Ajout d'un endpoint pour la recherche de mots par catégorie.

## Estimation de confiance

**Moyenne**

## Hypothèses

1. J'ai supposé que la recherche devait être insensible à la casse (utilisation de regex avec flag 'i')
2. J'ai paginé les résultats (limite de 50 par défaut) pour éviter les surcharges
3. J'ai considéré que les catégories sont stockées en lowercase dans la DB

## Questions de suivi

1. Faut-il ajouter un filtre par niveau de difficulté également ?
2. La limite de 50 résultats est-elle appropriée ou doit-elle être configurable ?
3. Doit-on logger les recherches pour des statistiques futures ?

## Alternatives considérées

- Recherche exacte (écartée car moins flexible)
- Full-text search MongoDB (écartée car complexité non justifiée pour le MVP)
```

### ✅ Exemple 2 : Bonne question avant implémentation

```markdown
Question : L'endpoint doit-il filtrer les mots par statut (actif/archivé) ?

Contexte : Je dois créer un endpoint de recherche de vocabulaire.
Le modèle `Word` a un champ `status` mais je ne sais pas si :

- Tous les mots doivent être retournés
- Seuls les mots actifs doivent être visibles
- Le statut doit être un paramètre optionnel de requête

Impact : Cela affecte la signature de l'endpoint et les tests à écrire.
```

### ❌ Exemple 3 : Mauvaise PR sans documentation

```markdown
## Description

Ajout recherche de mots

## Changements

- Ajout endpoint /api/words/search
- Tests ajoutés
```

**Problèmes** :

- Aucune hypothèse documentée
- Pas d'estimation de confiance
- Pas d'explication des choix techniques
- Impossible de reviewer efficacement

## Guidance pour les outils automatiques (Copilot, bots)

### Quand poser des questions de suivi

Les outils d'assistance IA (comme GitHub Copilot) doivent **poser des questions** au lieu de deviner lorsque :

1. **Ambiguïté fonctionnelle** :

   - Plusieurs implémentations possibles avec impacts différents
   - Besoin non spécifié (pagination, tri, filtres, etc.)
   - Format de données non précisé

2. **Impact sur l'architecture** :

   - Choix entre plusieurs patterns possibles
   - Création de nouvelles couches ou abstractions
   - Modification de contrats existants

3. **Sécurité ou performance** :

   - Gestion de données sensibles
   - Opérations potentiellement coûteuses
   - Validation ou sanitization des entrées

4. **Dépendances et compatibilité** :
   - Ajout de packages externes
   - Changement de versions
   - Breaking changes potentiels

### Format recommandé pour les questions Copilot

```markdown
❓ **Question de clarification**

**Contexte** : [Expliquer ce qui est demandé]

**Incertitude** : [Ce qui n'est pas clair]

**Options possibles** :

1. [Option A] - [Avantages/Inconvénients]
2. [Option B] - [Avantages/Inconvénients]

**Recommandation** : [Votre suggestion avec justification]

**Question** : Quelle option préférez-vous, ou y a-t-il d'autres contraintes à considérer ?
```

### Comportement des suggestions automatiques

- **Suggestions simples** : Peut être acceptée telle quelle si triviale
- **Suggestions moyennes** : Le contributeur humain doit vérifier les hypothèses et les documenter dans la PR
- **Suggestions complexes** : Doit poser des questions avant de générer du code

### Checklist automatique pour les bots

Les bots peuvent ajouter cette checklist automatiquement dans les PR :

```markdown
## Checklist PR (modifications non triviales)

- [ ] Estimation de confiance documentée (Haute/Moyenne/Faible)
- [ ] Hypothèses listées et justifiées
- [ ] Questions de suivi identifiées (si applicable)
- [ ] Alternatives considérées documentées
- [ ] Impact sur les tests existants évalué
- [ ] Impact sur la documentation évalué
- [ ] Migration ou breaking change documenté (si applicable)
```

## Questions de suivi types

Voici des exemples de questions pertinentes à poser selon le contexte :

### Base de données

- "Dois-je créer une migration pour ce changement de schéma ?"
- "Faut-il ajouter un index sur ce champ pour les performances ?"
- "Les données existantes doivent-elles être migrées ou transformées ?"

### API et endpoints

- "Quelle doit être la stratégie de pagination (offset, cursor, keyset) ?"
- "Faut-il versioner cet endpoint (v1, v2) pour compatibilité ?"
- "Les paramètres de tri/filtre doivent-ils être optionnels ou obligatoires ?"

### Sécurité et autorisation

- "Quels rôles peuvent accéder à cette fonctionnalité ?"
- "Dois-je logger cet accès pour audit ?"
- "Faut-il valider/sanitizer ces données en entrée ?"

### Tests

- "Dois-je créer des tests d'intégration en plus des tests unitaires ?"
- "Les tests existants sont-ils impactés par ce changement ?"
- "Faut-il mocker cette dépendance externe ou utiliser un conteneur de test ?"

### Architecture et design

- "Dois-je créer une nouvelle interface ou étendre l'existante ?"
- "Ce service doit-il être Singleton, Scoped ou Transient ?"
- "Faut-il appliquer le pattern Repository ici ou un accès direct ?"

### Performance

- "Y a-t-il une limite de taille attendue pour ce traitement ?"
- "Dois-je mettre en cache ces données ?"
- "Cette opération doit-elle être asynchrone ?"

## Révision et contrôle

### Responsabilités des reviewers

Les reviewers doivent vérifier que les PR comportent, le cas échéant :

1. **Pour modifications non triviales** :

   - ✅ Estimation de confiance présente et cohérente
   - ✅ Hypothèses documentées et raisonnables
   - ✅ Questions de suivi identifiées (si incertitudes)
   - ✅ Alternatives considérées (si applicable)

2. **En cas d'absence** :

   - ❌ Demander des éclaircissements avant l'acceptation
   - ❌ Laisser un commentaire avec le template de documentation attendu
   - ❌ Marquer la PR comme "Changes requested"

3. **Processus de review** :
   - Vérifier que les hypothèses sont valides
   - Challenger les choix techniques si nécessaire
   - Suggérer des améliorations ou alternatives
   - Valider que les questions de suivi ont des réponses

### Template de commentaire pour reviewer

```markdown
Cette PR nécessite de la documentation supplémentaire :

**Manquant** :

- [ ] Estimation de confiance
- [ ] Liste des hypothèses
- [ ] Questions de suivi

**Veuillez ajouter** :

1. Votre niveau de confiance (Haute/Moyenne/Faible)
2. Les hypothèses que vous avez faites pour cette implémentation
3. Les points qui nécessiteraient une clarification

Voir : `.github/instructions/instruction-relative-aux-questions-de-suivi.md`
```

## Quand NE PAS appliquer ce processus

Ce processus peut être **optionnel** ou **simplifié** dans les cas suivants :

### Situations d'urgence

- **Hotfixes critiques** : bug en production bloquant
- **Failles de sécurité** : patch urgent nécessaire
- **Incident majeur** : restauration de service

**Dans ces cas** :

1. Appliquer le processus d'urgence défini par l'équipe
2. Documenter a posteriori dans un post-mortem
3. Informer les maintainers immédiatement

### Contributions mineures

- Corrections de typos
- Mise à jour de dépendances sans breaking change
- Formatage automatique (linter)
- Ajout de commentaires

### Travail exploratoire

- POC (Proof of Concept)
- Spike technique
- Prototypes jetables

**Dans ces cas** : Marquer clairement la PR avec un label `[POC]` ou `[WIP]`

## Exemples de workflow complet

### Scénario 1 : Ajout d'un filtre de recherche

**Demande utilisateur** : "Ajouter la possibilité de filtrer les mots par niveau de difficulté"

**1. Questions préalables posées** :

```markdown
Questions avant implémentation :

1. Les niveaux de difficulté sont-ils prédéfinis (ex: facile/moyen/difficile)
   ou libres (1-10) ?
2. Le filtre doit-il être combinable avec d'autres filtres existants ?
3. Doit-on permettre la sélection de plusieurs niveaux simultanément ?
```

**2. Réponses reçues** :

- Niveaux prédéfinis : "beginner", "intermediate", "advanced"
- Oui, combinable avec recherche textuelle
- Multi-sélection autorisée

**3. PR soumise avec documentation** :

```markdown
## Description

Ajout du filtre par niveau de difficulté sur l'endpoint de recherche

## Estimation de confiance

**Haute**

## Hypothèses

1. Les niveaux sont stockés en lowercase dans MongoDB
2. Le paramètre accepte plusieurs valeurs séparées par virgule
3. Si aucun niveau n'est spécifié, tous les mots sont retournés

## Implémentation

- Paramètre query : `?levels=beginner,intermediate`
- Validation : seules les valeurs ["beginner", "intermediate", "advanced"] acceptées
- Combinaison avec recherche textuelle via opérateur $and

## Tests ajoutés

- Filtre par un seul niveau
- Filtre par plusieurs niveaux
- Combinaison avec recherche textuelle
- Validation des valeurs invalides
```

### Scénario 2 : Refactoring d'architecture

**Besoin** : "Améliorer la structure du code pour les repositories"

**1. Question posée** :

```markdown
❓ **Question de clarification**

**Contexte** : Le code actuel a des repositories qui accèdent directement
à MongoDB dans Infrastructure. Certaines logiques de filtrage sont dupliquées.

**Incertitude** : Dois-je :

- Créer une classe de base `BaseRepository<T>` avec les opérations CRUD communes ?
- Extraire les filtres complexes dans des classes séparées (Specification pattern) ?
- Ou conserver l'approche actuelle et juste factoriser les méthodes dupliquées ?

**Options possibles** :

1. BaseRepository + classes héritées
   - ✅ Moins de duplication
   - ❌ Couplage par héritage
2. Specification pattern
   - ✅ Filtres réutilisables et testables
   - ❌ Complexité accrue
3. Méthodes helper statiques
   - ✅ Simple et direct
   - ❌ Moins orienté objet

**Recommandation** : Option 1 (BaseRepository) pour commencer,
puis Option 2 (Specifications) si les filtres deviennent trop complexes.

**Question** : Quelle approche préférez-vous pour ce projet ?
```

**2. Après réponse et implémentation** :

```markdown
## Description

Refactoring des repositories avec BaseRepository générique

## Estimation de confiance

**Moyenne**

## Décision retenue

Création de BaseRepository<TEntity, TDocument> avec méthodes CRUD communes

## Hypothèses

1. Toutes les entités auront un Id de type string
2. Les opérations CRUD de base sont suffisantes pour 80% des cas
3. Les repositories spécifiques peuvent surcharger ou étendre

## Questions de suivi

1. Faut-il ajouter des méthodes de soft delete ?
2. Les transactions doivent-elles être gérées au niveau du repository ?

## Impact

- ✅ Réduit la duplication de ~200 lignes
- ⚠️ Nécessite migration des tests existants
- ⚠️ Breaking change pour repositories existants (migration nécessaire)

## Plan de migration

1. Créer BaseRepository
2. Migrer UserRepository (avec tests)
3. Migrer WordRepository (avec tests)
4. Supprimer code dupliqué
```

## Remarques finales

- Cette instruction vise à améliorer la qualité des contributions et la collaboration
- Adaptez-la raisonnablement selon le contexte (urgent vs non urgent)
- Privilégiez toujours la communication et la clarté
- En cas de doute, demandez plutôt que de deviner
- Pour toute modification ou précision de cette instruction, ouvrez une issue et taggez les maintainers

## Ressources complémentaires

- `.github/copilot-instructions.md` - Guidelines générales de contribution
- `.github/instructions/clean-architecture-instructions.md` - Principes d'architecture
- `.github/instructions/csharp.instructions.md` - Conventions C#
- `.github/instructions/react.instructions.md` - Conventions React
- `.github/instructions/mongodb.instructions.md` - Bonnes pratiques MongoDB
