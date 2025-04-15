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

        public class Day(string title, string description, DateOnly date)
        {
            public string Title { get; set; } = title;
            public string Description { get; set; } = description;
            public DateOnly Date { get; set; } = date;
        }
    }
}
