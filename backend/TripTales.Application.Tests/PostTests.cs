using System;
using System.Linq;
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

        [Fact]
        public void Update_WhenPicturesChange_ShouldKeepOnlyOwnedAndReturnUnused()
        {
            var author = new User("author", "author@example.com", "P@ssword1", "Author");
            var start = DateOnly.FromDateTime(DateTime.UtcNow);
            var sut = new Post("Old", "Old", author, start, start.AddDays(2),
                new() { new Post.Day("Day", "Day", start) { Pictures = new() { "Images/day.jpg", "Images/gone.jpg" } } });
            sut.Pictures.Add("Images/post.jpg");

            var newDay = new Post.Day("New day", "New", start.AddDays(1)) { Pictures = new() { "Images/day.jpg", "Images/foreign.jpg" } };
            var unused = sut.Update("New", "New", start, start.AddDays(3), new() { "Images/foreign.jpg" }, new() { newDay });

            Assert.Equal("New", sut.Title);
            Assert.Equal(start.AddDays(3), sut.EndDate);
            Assert.Empty(sut.Pictures);
            Assert.Equal(new[] { "Images/day.jpg" }, Assert.Single(sut.Days).Pictures);
            Assert.Equal(new[] { "Images/gone.jpg", "Images/post.jpg" }, unused.OrderBy(p => p));
        }
    }
}
