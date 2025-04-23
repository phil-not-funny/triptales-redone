using System;
using System.Collections.Generic;

namespace Triptales.Application.Model
{
    public class Comment : BaseEntity
    {
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
        protected Comment() { }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.

        public Comment(User author, string content, Comment? parent = null, Post? post = null)
        {
            Post = post;
            Author = author;
            Content = content;
            CreatedAt = DateOnly.FromDateTime(DateTime.Now);
            Parent = parent;
        }

        public Post? Post { get; set; }
        public User Author { get; set; }
        public Comment? Parent { get; set; }
        public string Content { get; set; }
        public DateOnly CreatedAt { get; set; }
        public List<Comment> Comments { get; } = new();
        public List<User> Likes { get; } = new();
    }
}
