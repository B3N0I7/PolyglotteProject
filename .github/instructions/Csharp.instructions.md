---
applyTo: "**/*.cs"
---

## Principales Règles de Codage en C#

### 1. **Conventions de Nommage** (Critique !)

- **Variables et paramètres** :
  - Noms en **camelCase** (minuscules pour la première lettre, puis majuscules pour les mots suivants).  
    Ex: `int nombreDeJours;`
- **Méthodes et propriétés** :
  - **PascalCase** (majuscule pour la première lettre de chaque mot).  
    Ex: `public void CalculerTotal() { ... }`
- **Classes et interfaces** :
  - **PascalCase**.  
    Ex: `public class ClientManager : IClientService`
- **Constantes** :
  - **MAJUSCULES** avec des `_` entre les mots.  
    Ex: `const int MAX_TAILLE = 100;`
- **Évitez les abréviations** :  
  Préférez `CalculerTotal()` à `CalcTot()`.

---

### 2. **Indentation et Formatage**

- **Tabulations** :  
  Utilisez des **espaces** (4 espaces par niveau) ou des tabulations configurées dans l'IDE.
- **Accolades `{}`** :  
  Toujours utiliser des accolades, même pour les blocs `if`/`else` à une ligne.  
  ✅ DO
  ```csharp
  if (condition)
  {
      // Code
  }
  else
  {
      // Code
  }
  ```
- **Espacement** :
  - Un espace après une virgule (`,`), autour des opérateurs (`=`, `+`, `==`, etc.).  
    Ex: `int a = 5 + (b * c);`
  - Pas d'espace entre un nom de méthode et `(`.  
    Ex: `MaMethode()`.

---

### 3. **Commentaires et Documentation**

- **Commentaires** :
  - Expliquez le **"pourquoi"** plutôt que le "quoi".
  - Évitez les commentaires redondants.
- **Documentation XML** :  
  Utilisez `///` pour générer une documentation IntelliSense.  
  ✅ DO
  ```csharp
  /// <summary>
  /// Calcule la taxe sur un montant.
  /// </summary>
  /// <param name="montant">Le montant HT.</param>
  /// <returns>Le montant TTC.</returns>
  public decimal CalculerTaxe(decimal montant) { ... }
  ```

---

### 4. **Bonnes Pratiques de Programmation**

- **DRY (Don't Repeat Yourself)** :  
  Évitez le code dupliqué. Factorisez les logiques répétitives.
- **Principes SOLID** :  
  Respectez les principes :

  1. Single Responsability Principle
     ❌ DON'T DO

  ```csharp
  public class Employe
  {
      public string Nom { get; set; }
      public decimal Salaire { get; set; }

      public decimal CalculerSalaire()
      {
          return Salaire * 1.2m;
      }

      public void SauvegarderEnBase()
      {
          // Code SQL pour sauvegarder l'employé
          Console.WriteLine($"INSERT INTO Employes VALUES ('{Nom}', {Salaire})");
      }

      public void GenererRapportPDF()
      {
          // Code pour générer un PDF
          Console.WriteLine($"Génération du PDF pour {Nom}");
      }
  }
  ```

  ✅ DO

  ```csharp
  public class Employe
  {
      public string Nom { get; set; }
      public decimal Salaire { get; set; }
  }

  public class CalculateurSalaire
  {
      public decimal Calculer(Employe employe)
      {
          return employe.Salaire * 1.2m;
      }
  }

  public class EmployeRepository
  {
      public void Sauvegarder(Employe employe)
      {
          Console.WriteLine($"Sauvegarde de {employe.Nom} en base");
      }
  }
  public class GenerateurRapport
  {
      public void GenererPDF(Employe employe)
      {
          Console.WriteLine($"Génération PDF pour {employe.Nom}");
      }
  }
  ```

  2. Open/Closed Principle
     ❌ DON'T DO

  ```csharp
  public class CalculateurRemise
  {
  public decimal CalculerPrix(decimal prix, string typeClient)
    {
        switch (typeClient)
        {
            case "Normal":
                return prix;
            case "Premium":
                return prix * 0.9m;
            case "VIP":
                return prix * 0.8m;
            default:
                return prix;
        }
        // Pour ajouter un nouveau type, il faut modifier cette méthode
    }
  }
  ```

  ✅ DO

  ```csharp
  public interface IRemiseStrategy
  {
      decimal Calculer(decimal prix);
  }

  public class RemiseNormal : IRemiseStrategy
  {
      public decimal Calculer(decimal prix)
      {
          return prix;
      }
  }

  public class RemisePremium : IRemiseStrategy
  {
      public decimal Calculer(decimal prix)
      {
          return prix * 0.9m;
      }
  }

  public class RemiseVIP : IRemiseStrategy
  {
      public decimal Calculer(decimal prix)
      {
          return prix * 0.8m;
      }
  }

  // On peut ajouter de nouveaux types sans modifier le code existant
  public class RemisePlatinum : IRemiseStrategy
  {
      public decimal Calculer(decimal prix)
      {
          return prix * 0.7m;
      }
  }

  public class CalculateurPrix
  {
      private readonly IRemiseStrategy _strategie;

      public CalculateurPrix(IRemiseStrategy strategie)
      {
          _strategie = strategie;
      }

      public decimal CalculerPrixFinal(decimal prix)
      {
          return _strategie.Calculer(prix);
      }
  }
  ```

  3. Liskov Substitution Principle
     ❌ DON'T DO

  ```csharp
  public class Oiseau
  {
      public virtual string Voler()
      {
          return "Je vole !";
      }
  }

  public class Aigle : Oiseau
  {
      public override string Voler()
      {
          return "Je vole haut !";
      }
  }

  public class Pingouin : Oiseau
  {
      public override string Voler()
      {
          throw new NotSupportedException("Je ne peux pas voler !");  // Viole LSP
      }
  }
  ```

  ✅ DO

  ````csharp
  public abstract class Oiseau
  {
      public abstract string SeDeplacer();
  }

  public abstract class OiseauVolant : Oiseau
  {
      public override string SeDeplacer()
      {
          return "Je me déplace en volant";
      }

      public virtual string Voler()
      {
          return "Je bats des ailes";
      }
  }

  public abstract class OiseauNonVolant : Oiseau
  {
      public override string SeDeplacer()
      {
          return "Je me déplace en marchant";
      }

      public virtual string Nager()
      {
          return "Je nage";
      }
  }

  public class Aigle : OiseauVolant
  {
      public override string Voler()
      {
          return "Je plane majestueusement";
      }
  }

  public class Pingouin : OiseauNonVolant
  {
      public override string Nager()
      {
          return "Je nage rapidement sous l'eau";
      }
  }
      ```
  4. Interface Segregation Principle
      ❌ DON'T DO
      ```csharp
  public interface IMachine
  {
      void Imprimer(string document);
      void Scanner(string document);
      void Photocopier(string document);
  }

  public class ImprimanteSimple : IMachine
  {
      public void Imprimer(string document)
      {
          Console.WriteLine($"Impression de : {document}");
      }

      public void Scanner(string document)
      {
          throw new NotImplementedException("Cette imprimante ne scanne pas");
      }

      public void Photocopier(string document)
      {
          throw new NotImplementedException("Cette imprimante ne photocopie pas");
      }
  }
  ````

  ✅ DO

  ```csharp
  public interface IImprimante
  {
      void Imprimer(string document);
  }

  public interface IScanner
  {
      void Scanner(string document);
  }

  public interface IPhotocopieuse
  {
      void Photocopier(string document);
  }

  public class ImprimanteSimple : IImprimante
  {
      public void Imprimer(string document)
      {
          Console.WriteLine($"Impression de : {document}");
      }
  }

  public class ImprimanteMultifonction : IImprimante, IScanner, IFax, IPhotocopieuse
  {
      public void Imprimer(string document)
      {
          Console.WriteLine($"Impression de : {document}");
      }

      public void Scanner(string document)
      {
          Console.WriteLine($"Scan de : {document}");
      }

      public void Photocopier(string document)
      {
          Console.WriteLine($"Photocopie de : {document}");
      }
  }

  public class ImprimanteScanneur : IImprimante, IScanner
  {
      public void Imprimer(string document)
      {
          Console.WriteLine($"Impression de : {document}");
      }

      public void Scanner(string document)
      {
          Console.WriteLine($"Scan de : {document}");
      }
  }
  ```

  5. Dependency Inversion Principle
     ❌ DON'T DO

  ```csharp
  public class EmailGmail
  {
      public void Envoyer(string message)
      {
          Console.WriteLine($"Envoi via Gmail: {message}");
      }
  }

  public class NotificationService
  {
      private EmailGmail _email;

      public NotificationService()
      {
          _email = new EmailGmail();  // Dépendance directe et couplage fort
      }

      public void Notifier(string message)
      {
          _email.Envoyer(message);
      }
  }
  ```

  ✅ DO

  ```csharp
  // Abstraction
  public interface IEmailService
  {
      void Envoyer(string message);
  }

  // Implémentations concrètes
  public class EmailGmail : IEmailService
  {
      public void Envoyer(string message)
      {
          Console.WriteLine($"Envoi via Gmail: {message}");
      }
  }

  public class EmailOutlook : IEmailService
  {
      public void Envoyer(string message)
      {
          Console.WriteLine($"Envoi via Outlook: {message}");
      }
  }

  public class EmailSendGrid : IEmailService
  {
      public void Envoyer(string message)
      {
          Console.WriteLine($"Envoi via SendGrid API: {message}");
      }
  }

  // Service de haut niveau
  public class NotificationService
  {
      private readonly IEmailService _emailService;

      // Injection de dépendance via constructeur
      public NotificationService(IEmailService emailService)
      {
          _emailService = emailService;
      }

      public void Notifier(string message)
      {
          _emailService.Envoyer(message);
      }
  }

  // Usage avec injection de dépendance
  public class Program
  {
      public static void Main()
      {
          // On peut facilement changer d'implémentation
          var notifGmail = new NotificationService(new EmailGmail());
          notifGmail.Notifier("Message important");

          var notifOutlook = new NotificationService(new EmailOutlook());
          notifOutlook.Notifier("Message important");

          // Avec un conteneur IoC (ex: dans ASP.NET Core)
          // services.AddScoped<IEmailService, EmailSendGrid>();
          // services.AddScoped<NotificationService>();
      }
  }
  ```

- **Lisibilité** :  
  Limitez la complexité des méthodes. Une méthode ne devrait pas dépasser 20-30 lignes.
- **Gestion des ressources** :  
  Utilisez `IDisposable` pour les ressources non-managées (fichiers, connexions DB).  
  Exemple avec `using` :
  ```csharp
  using (StreamReader sr = new StreamReader("fichier.txt"))
  {
      // Utilisation de sr
  } // sr est automatiquement disposé
  ```

---

### 5. **Gestion des Erreurs**

- **Ne pas ignorer les exceptions** :  
  Évitez les blocs `catch` vides. Loggez les erreurs ou gérez-les.
- **Utilisez des exceptions spécifiques** :  
  Préférez `FileNotFoundException` à une générique `Exception`.
- **Validez les entrées** :  
  Vérifiez les arguments des méthodes publiques (ex: `ArgumentNullException`).

---

### 6. **Performance**

- **Évitez les boxing/unboxing** :  
  Préférez les types génériques (`List<T>`) aux `ArrayList`.
- **LINQ** :  
  Évitez les requêtes LINQ trop complexes. Mesurez les performances.
- **StringBuilder** :  
  Pour les chaînes concaténées dans des boucles, utilisez `StringBuilder`.

---

### 7. **Sécurité**

- **Validation des entrées** :  
  Évitez les injections SQL en utilisant des paramètres (ex: `SqlParameter`).
- **Cryptage** :  
  Utilisez les bibliothèques intégrées (`System.Security.Cryptography`) pour les données sensibles.
- **HTTPS** :  
  Forcer HTTPS dans les APIs (attribut `[RequireHttps]`).

---

### 8. **Tests Unitaires**

- **Couverture** :  
  Ciblez au moins 70-80% de couverture (selon les projets critiques).
- **Frameworks** :  
  Utilisez **xUnit**, **Moq**, **System.Assert**.
- **Bonnes pratiques** :
  - Tests **indépendants** et **rapides**.
  - Une méthode de test = une assertion (ou groupe logique).
  - Nommez les tests clairement : `[NomMethode]_[Scenario]_[ResultatAttendu]`.

---

### 9. **Asynchrone**

- **Utilisez `async`/`await`** :  
  Pour les opérations I/O-bound (appels réseaux, DB) ou CPU-bound longues.  
  Exemple :
  ```csharp
  public async Task ChargerDonneesAsync()
  {
      var donnees = await httpClient.GetStringAsync("https://exemple.com");
  }
  ```
- **Ne bloquez pas sur des async** :  
  Évitez `.Result` ou `.Wait()` → préférez `await`.

---

### 10. **Accessibilité**

- **Modificateurs d'accès** :  
  Spécifiez toujours `public`, `private`, `protected`, ou `internal`.  
  Par défaut, utilisez `private` pour les membres de classe.
- **Propriétés vs champs** :  
  Préférez les propriétés aux champs publics.  
  ❌ DON'T DO
  ```csharp
  public string Prenom;
  ```
  ✅ DO
  ```csharp
  public string Nom { get; set; }
  ```

---

### 11. **Gestion de la Nullité (Nullable Reference Types)**

- **Activer les types nullables** :  
  Dans le fichier `.csproj`, activez `<Nullable>enable</Nullable>` pour toute la solution. Cela transforme les références de type `string` en non-nullable par défaut, et `string?` en nullable.
- **Principe** :  
  Le compilateur vous avertira si vous tentez d'utiliser une variable potentiellement nulle sans avoir vérifié sa nullité au préalable. C'est le meilleur moyen d'éviter les `NullReferenceException`.
- **Bonnes pratiques** :  
  ❌ DON'T DO

  ```csharp
  public string GetNomComplet(Personne personne)
  {
      // Risque de NullReferenceException si personne est null
      return $"{personne.Prenom} {personne.Nom}";
  }
  ```

  ✅ DO

  ```csharp
  public string GetNomComplet(Personne? personne)
  {
      // Vérification obligatoire de la nullité
      if (personne == null)
      {
          return "Inconnu";
      }
      return $"{personne.Prenom} {personne.Nom}";
  }

  // Utiliser l'opérateur de coalescence nulle (??)
  string nom = personne?.Nom ?? "Nom par défaut";
  ```

---

### 12. **Architecture et Structure de Projet**

- **Namespaces** :  
  Organisez les namespaces de manière logique et hiérarchique pour éviter les collisions. Convention : `Societe.Projet.Module`.
- **Structure des dossiers** :  
  Adoptez une structure claire, par exemple une "Clean Architecture" :
  - `src/`
    - `MonProjet.Api/` (Contrôleurs, points d'entrée)
    - `MonProjet.Application/` (Logique métier, services, interfaces)
    - `MonProjet.Domain/` (Entités, modèles de domaine, interfaces de repos)
    - `MonProjet.Infrastructure/` (Accès aux données, implémentations concrètes)
  - `tests/`
    - `MonProjet.UnitTests/`
    - `MonProjet.IntegrationTests/`

---

### 13. **Injection de Dépendances (DI) et Conteneurs IoC**

- **Principe** :  
  Ne créez jamais manuellement une dépendance dans une classe qui en a besoin. Fournissez-la via le constructeur (Constructor Injection).
- **Conteneur IoC** :  
  Dans les applications modernes (ex: ASP.NET Core), utilisez le conteneur intégré (`IServiceCollection`) pour enregistrer les services et leurs durées de vie.
  ✅ DO
  ```csharp
  // Dans Program.cs (ASP.NET Core 6+)
  builder.Services.AddScoped<IEmailService, EmailGmail>(); // Scoped = une instance par requête HTTP
  builder.Services.AddSingleton<ICalculateurTaxe, CalculateurTaxe>(); // Singleton = une instance pour toute l'application
  builder.Services.AddTransient<IGenerateurRapport, GenerateurRapportPdf>(); // Transient = une nouvelle instance à chaque demande
  ```

---

### 14. **Logging et Configuration**

- **Logging** :  
  N'utilisez jamais `Console.WriteLine` pour le logging en production. Injectez et utilisez `ILogger<T>` de `Microsoft.Extensions.Logging`.
  ✅ DO

  ```csharp
  public class EmployeService
  {
      private readonly ILogger<EmployeService> _logger;
      private readonly IEmployeRepository _repository;

      public EmployeService(ILogger<EmployeService> logger, IEmployeRepository repository)
      {
          _logger = logger;
          _repository = repository;
      }

      public void Sauvegarder(Employe employe)
      {
          try
          {
              _repository.Sauvegarder(employe);
              _logger.LogInformation("L'employé {NomEmploye} a été sauvegardé avec succès.", employe.Nom);
          }
          catch (Exception ex)
          {
              _logger.LogError(ex, "Erreur lors de la sauvegarde de l'employé {NomEmploye}.", employe.Nom);
              throw;
          }
      }
  }
  ```

- **Configuration** :  
  Utilisez le pattern `IOptions<T>` pour accéder à la configuration depuis `appsettings.json` de manière typée et sécurisée.

---

### 15. **Bonnes Pratiques pour les APIs Web (REST)**

- **Utilisez des DTOs (Data Transfer Objects)** :  
  N'exposez jamais directement vos entités de base de données. Créez des DTOs spécifiques pour chaque endpoint afin de découpler le contrat de l'API de votre modèle de données interne.
- **Nomenclature des routes** :  
  Utilisez des noms de pluriels pour les collections de ressources : `/api/produits` et non `/api/produit`.
- **Codes d'état HTTP** :  
  Retournez les codes d'état appropriés : `200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`. Utilisez les méthodes helpers de `IActionResult` (`Ok()`, `NotFound()`, `BadRequest()`).
- **Validation** :  
  Utilisez les attributs de validation (`[Required]`, `[StringLength]`, etc.) sur vos DTOs et le filtre `[ApiController]` pour une validation automatique.
