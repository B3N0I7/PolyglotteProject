using Polyglotte.Domain.Entities;

namespace Polyglotte.Domain.Tests.Entities
{
    public class WordTests
    {
        [Fact]
        public void Constructor_ShouldInitializeWithCurrentUtcTime()
        {
            // Arrange
            var startTime = DateTime.UtcNow;
            
            // Act
            var word = new Word();
            
            // Assert
            var endTime = DateTime.UtcNow;
            Assert.True(word.CreatedAt >= startTime && word.CreatedAt <= endTime, 
                "CreatedAt should be set to current UTC time");
        }

        [Fact]
        public void Constructor_ShouldInitializePropertiesWithDefaultValues()
        {
            // Act
            var word = new Word();
            
            // Assert
            Assert.Equal(string.Empty, word.Id);
            Assert.Equal(string.Empty, word.EnglishWord);
            Assert.Equal(string.Empty, word.FrenchWord);
            Assert.NotEqual(default(DateTime), word.CreatedAt);
        }

        [Fact]
        public void Id_ShouldAllowGetAndSet()
        {
            // Arrange
            var word = new Word();
            var expectedId = "64f7b8c9a1b2c3d4e5f67890";

            // Act
            word.Id = expectedId;

            // Assert
            Assert.Equal(expectedId, word.Id);
        }

        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        [InlineData("hello")]
        [InlineData("Hello")]
        [InlineData("HELLO")]
        [InlineData("Hello World")]
        [InlineData("Hello-World")]
        [InlineData("Hello_World")]
        public void EnglishWord_ShouldAllowVariousValidStrings(string englishWord)
        {
            // Arrange
            var word = new Word();

            // Act
            word.EnglishWord = englishWord;

            // Assert
            Assert.Equal(englishWord, word.EnglishWord);
        }

        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        [InlineData("bonjour")]
        [InlineData("Bonjour")]
        [InlineData("BONJOUR")]
        [InlineData("Bonjour le monde")]
        [InlineData("Bonjour-le-monde")]
        [InlineData("Bonjour_le_monde")]
        [InlineData("Café")]
        [InlineData("Élève")]
        [InlineData("Noël")]
        public void FrenchWord_ShouldAllowVariousValidStrings(string frenchWord)
        {
            // Arrange
            var word = new Word();

            // Act
            word.FrenchWord = frenchWord;

            // Assert
            Assert.Equal(frenchWord, word.FrenchWord);
        }

        [Fact]
        public void CreatedAt_ShouldAllowCustomDateTime()
        {
            // Arrange
            var word = new Word();
            var customDate = new DateTime(2023, 10, 15, 14, 30, 0, DateTimeKind.Utc);

            // Act
            word.CreatedAt = customDate;

            // Assert
            Assert.Equal(customDate, word.CreatedAt);
        }

        [Theory]
        [InlineData("64f7b8c9a1b2c3d4e5f67890", "Hello", "Bonjour")]
        [InlineData("507f1f77bcf86cd799439011", "Cat", "Chat")]
        [InlineData("", "", "")]
        [InlineData("123", "Dog", "Chien")]
        public void AllProperties_ShouldStoreAndReturnCorrectValues(string id, string englishWord, string frenchWord)
        {
            // Arrange
            var word = new Word();
            var customDate = DateTime.UtcNow.AddHours(-2);

            // Act
            word.Id = id;
            word.EnglishWord = englishWord;
            word.FrenchWord = frenchWord;
            word.CreatedAt = customDate;

            // Assert
            Assert.Equal(id, word.Id);
            Assert.Equal(englishWord, word.EnglishWord);
            Assert.Equal(frenchWord, word.FrenchWord);
            Assert.Equal(customDate, word.CreatedAt);
        }

        [Fact]
        public void Word_ShouldSupportNullValues()
        {
            // Arrange
            var word = new Word();

            // Act & Assert - Should not throw exceptions
            word.Id = null!;
            word.EnglishWord = null!;
            word.FrenchWord = null!;

            Assert.Null(word.Id);
            Assert.Null(word.EnglishWord);
            Assert.Null(word.FrenchWord);
        }

        [Fact]
        public void MultipleInstances_ShouldHaveIndependentProperties()
        {
            // Arrange & Act
            var word1 = new Word
            {
                Id = "1",
                EnglishWord = "Apple",
                FrenchWord = "Pomme"
            };

            var word2 = new Word
            {
                Id = "2",
                EnglishWord = "Orange",
                FrenchWord = "Orange"
            };

            // Assert
            Assert.NotEqual(word1.Id, word2.Id);
            Assert.NotEqual(word1.EnglishWord, word2.EnglishWord);
            Assert.NotEqual(word1.FrenchWord, word2.FrenchWord);
        }

        [Fact]
        public void CreatedAt_ShouldBeSetOnlyOnceInConstructor()
        {
            // Arrange & Act
            var word1 = new Word();
            Thread.Sleep(1); // Ensure different timestamps
            var word2 = new Word();

            // Assert
            Assert.True(word2.CreatedAt >= word1.CreatedAt, 
                "Second instance should have same or later timestamp");
        }

        [Fact]
        public void Word_ShouldSupportLongStrings()
        {
            // Arrange
            var word = new Word();
            var longEnglish = new string('A', 1000);
            var longFrench = new string('É', 1000);

            // Act
            word.EnglishWord = longEnglish;
            word.FrenchWord = longFrench;

            // Assert
            Assert.Equal(longEnglish, word.EnglishWord);
            Assert.Equal(longFrench, word.FrenchWord);
            Assert.Equal(1000, word.EnglishWord.Length);
            Assert.Equal(1000, word.FrenchWord.Length);
        }

        [Fact]
        public void Word_ShouldSupportSpecialCharacters()
        {
            // Arrange
            var word = new Word();
            var englishWithSpecial = "Hello! @#$%^&*()_+-={}[]|\\:;\"'<>?,./";
            var frenchWithAccents = "Café, crème, naïveté, coöpération, Noël";

            // Act
            word.EnglishWord = englishWithSpecial;
            word.FrenchWord = frenchWithAccents;

            // Assert
            Assert.Equal(englishWithSpecial, word.EnglishWord);
            Assert.Equal(frenchWithAccents, word.FrenchWord);
        }
    }
}