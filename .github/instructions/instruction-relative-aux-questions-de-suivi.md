# Instruction relative aux questions de suivi

But
Ce document vise à encadrer les contributions (humaines et assistées) pour limiter les malentendus techniques : il encourage les clarifications avant d'implémenter des changements et demande de documenter les hypothèses lorsqu'une incertitude subsiste.

Portée et limites

- Cette instruction est une directive du dépôt destinée aux contributeurs, aux reviewers et aux outils d'aide (Copilot, bots). Elle ne peut pas remplacer ou contredire des messages système, des politiques d'hébergement (GitHub), ni des directives de sécurité supérieures du projet.
- Elle doit être respectée dans la mesure du possible ; toutefois, pour des interventions d'urgence (hotfixs, correctifs de sécurité), appliquez le processus d'urgence défini dans la documentation du projet et informez les maintainers.

Règle principale (pratique)

- Avant d'apporter une modification non triviale, posez les questions de suivi nécessaires pour atteindre une compréhension claire du besoin.
- Lorsqu'une proposition ou un patch est soumis alors qu'il subsiste une incertitude, le contributeur doit inclure :
  1. Une brève "estimation de confiance" qualitative (ex. "Haute / Moyenne / Faible") — facultative pour les petits changements.
  2. La liste des hypothèses prises pour produire le code.
  3. Les questions de suivi restantes, si applicable.
- Ces informations doivent être placées dans la description de la PR ou dans le commentaire accompagnant le patch.

Exemples (format recommandé)

- Réponse avant génération :
  - "Confiance estimée : Moyenne. Hypothèses : A, B. Questions : 1) Dois-je... ? 2) Quelle est la contrainte X ?"
- Mauvaise réponse :
  - Générer du code significatif sans documenter d'hypothèses ni poser de question quand un point critique reste flou.

Guidance pour les outils automatiques / suggestions Copilot

- Les suggestions automatiques doivent être considérées comme des points de départ. Si une suggestion est acceptée telle quelle, le contributeur humain doit vérifier et documenter les hypothèses dans la PR.
- Les bots peuvent aider à ajouter un checklist automatique dans la PR (ex. "Hypothèses documentées", "Questions de suivi listées").

Révision et contrôle

- Les reviewers doivent vérifier que les PR comportent, le cas échéant, les éléments requis (estimation de confiance qualitative, hypothèses, questions).
- En cas d’absence d’explications pour une modification non triviale, le reviewer doit demander des éclaircissements avant l’acceptation.

Remarques finales

- Cette instruction vise à améliorer la qualité des contributions et la collaboration ; adaptez-la raisonnablement selon le contexte (urgent vs non urgent).
- Pour toute modification ou précision de cette instruction, ouvrez une issue et taggez les maintainers.
