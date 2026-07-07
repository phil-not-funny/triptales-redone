using System;
using Xunit;
using Triptales.Application.Model;

namespace Triptales.Application.Tests
{
    public sealed class PostTests
    {
        [Fact]
        public void Constructor_WhenCalled_ShouldInitializePropertiesAndCollections()
        {
            var author = new User("author", "author@example.com", "P@ssword1", "Author");
            var startDate = DateOnly.FromDateTime(DateTime.UtcNow);
            var endDate = startDate.AddDays(3);

            var sut = new Post("Trip Title", "Trip description", author, startDate, endDate);

            Assert.Equal("Trip Title", sut.Title);
            Assert.Equal("Trip description", sut.Description);
            Assert.Equal(author, sut.Author);
            Assert.Equal(startDate, sut.StartDate);
            Assert.Equal(endDate, sut.EndDate);
            Assert.NotNull(sut.Likes);
            Assert.NotNull(sut.Days);
            Assert.NotNull(sut.Comments);
            Assert.Empty(sut.Likes);
            Assert.Empty(sut.Days);
            Assert.Empty(sut.Comments);
        }

        [Fact]
        public void Likes_WhenUserAdded_ShouldContainUser()
        {
            var author = new User("author", "author@example.com", "P@ssword1", "Author");
            var liker = new User("liker", "liker@example.com", "P@ssword2", "Liker");
            var sut = new Post("Trip Title", "Trip description", author, DateOnly.FromDateTime(DateTime.UtcNow), DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1));

            sut.Likes.Add(liker);

            Assert.Single(sut.Likes);
            Assert.Contains(liker, sut.Likes);
        }
    }
}
