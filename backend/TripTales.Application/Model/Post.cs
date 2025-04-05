using System;
using System.Collections.Generic;

namespace Triptales.Application.Model
{
    public class Post : BaseEntity
    {
        public Post(string title, string description, User author, DateTime startDate, DateTime endDate)
        {
            Title = title;
            Description = description;
            Author = author;
            StartDate = startDate;
            EndDate = endDate;
        }

#pragma warning disable CS8618
        protected Post() { }
#pragma warning restore CS8618

        public string Title { get; set; }
        public string Description { get; set; }
        public User Author { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<User> Likes { get; } = new();
    }
}
