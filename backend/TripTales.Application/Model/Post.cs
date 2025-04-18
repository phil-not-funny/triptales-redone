using System;
using System.Collections.Generic;

namespace Triptales.Application.Model
{
    public class Post : BaseEntity
    {
        public Post(string title, string description, User author, DateOnly startDate, DateOnly endDate)
        {
            Title = title;
            Description = description;
            Author = author;
            StartDate = startDate;
            EndDate = endDate;
        }

        public Post(string title, string description, User author, DateOnly startDate, DateOnly endDate, List<Day> days) : this(title, description, author, startDate, endDate)
        {
            Days = days;
        }

#pragma warning disable CS8618
        protected Post() { }
#pragma warning restore CS8618

        public string Title { get; set; }
        public string Description { get; set; }
        public User Author { get; set; }
        public DateOnly CreatedAt { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public List<User> Likes { get; } = new();
        public List<Day> Days { get; } = new();
        public List<Comment> Comments { get; } = new();

        public class Day(string title, string description, DateOnly date)
        {
            public string Title { get; set; } = title;
            public string Description { get; set; } = description;
            public DateOnly Date { get; set; } = date;
        }

        public class Comment : BaseEntity
        {
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
            protected Comment() { }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.

            public Comment(Post post, User author, string content, Comment? parent = null)
            {
                Post = post;
                Author = author;
                Content = content;
                CreatedAt = DateOnly.FromDateTime(DateTime.Now);
                Parent = parent;
            }

            public Post Post { get; set; }
            public User Author { get; set; }
            public Comment? Parent { get; set; }
            public string Content { get; set; }
            public DateOnly CreatedAt { get; set; }
            public List<Comment> Comments { get; } = new();
            public List<User> Likes { get; } = new();
        }

        public Comment? FindCommentById(List<Comment> comments, Guid commentId)
        {
            if (comments == null || comments.Count == 0)
            {
                return null;
            }

            foreach (var comment in comments)
            {
                if (comment.Guid == commentId)
                {
                    return comment;
                }

                var found = FindCommentById(comment.Comments, commentId);
                if (found != null)
                {
                    return found;
                }
            }
            return null;
        }
    }
}
