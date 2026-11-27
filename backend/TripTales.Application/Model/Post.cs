using System;
using System.Collections.Generic;
using System.Linq;

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
        public List<string> Pictures { get; set; } = new();
        public List<User> Likes { get; } = new();
        public List<Day> Days { get; } = new();
        public List<Comment> Comments { get; } = new();

        public bool IsLikedBy(Guid? userGuid) => userGuid is not null && Likes.Any(u => u.Guid == userGuid);

        public List<string> Update(string title, string description, DateOnly startDate, DateOnly endDate, List<string> pictures, List<Day> days)
        {
            var owned = AllPictures().ToHashSet();

            Title = title;
            Description = description;
            StartDate = startDate;
            EndDate = endDate;
            Pictures = pictures.Where(owned.Contains).ToList();
            foreach (var day in days)
                day.Pictures = day.Pictures.Where(owned.Contains).ToList();
            Days.Clear();
            Days.AddRange(days);

            return owned.Except(AllPictures()).ToList();
        }

        private IEnumerable<string> AllPictures() => Pictures.Concat(Days.SelectMany(d => d.Pictures));

        public class Day(string title, string description, DateOnly date)
        {
            public string Title { get; set; } = title;
            public string Description { get; set; } = description;
            public DateOnly Date { get; set; } = date;
            public List<string> Pictures { get; set; } = new();
        }
    }
}
