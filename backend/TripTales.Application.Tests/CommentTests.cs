using System;
using Xunit;
using Triptales.Application.Model;

namespace Triptales.Application.Tests
{
    public sealed class CommentTests
    {
        [Fact]
        public void Constructor_WhenCalled_ShouldInitializeCommentHierarchy()
        {
            var author = new User("commenter", "commenter@example.com", "P@ssword3", "Commenter");
            var postAuthor = new User("poster", "poster@example.com", "P@ssword4", "Poster");
            var post = new Post("Trip Title", "Test description", postAuthor, DateOnly.FromDateTime(DateTime.UtcNow), DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1));
            var parentComment = new Comment(author, "Parent comment", null, post);

            var sut = new Comment(author, "Child comment", parentComment, post);
            parentComment.Comments.Add(sut);

            Assert.Equal(post, sut.Post);
            Assert.Equal(author, sut.Author);
            Assert.Equal(parentComment, sut.Parent);
            Assert.Equal("Child comment", sut.Content);
            Assert.NotEqual(default, sut.CreatedAt);
            Assert.Contains(sut, parentComment.Comments);
            Assert.Empty(sut.Comments);
            Assert.Empty(sut.Likes);
        }
    }
}
