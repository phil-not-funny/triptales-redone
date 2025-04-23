using System;
using System.Collections.Generic;
using System.Linq;
using Bogus;
using Microsoft.EntityFrameworkCore;
using Triptales.Application.Model;
using static Triptales.Application.Model.Post;

namespace Triptales.Webapi.Infrastructure
{
    public class TripTalesContext : DbContext
    {
        public TripTalesContext(DbContextOptions<TripTalesContext> options)
            : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Post> Posts => Set<Post>();
        public DbSet<Comment> Comments => Set<Comment>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Post>().HasMany(p => p.Likes)
                .WithMany(u => u.LikedPosts)
                .UsingEntity(j => j.ToTable("PostLikes"));
            modelBuilder.Entity<Comment>().HasMany(c => c.Likes)
                .WithMany(u => u.LikedPostComments)
                .UsingEntity(j => j.ToTable("PostCommentLikes"));
            modelBuilder.Entity<Post>().HasOne(p => p.Author)
                .WithMany(u => u.Posts);
            modelBuilder.Entity<Comment>().HasOne(c => c.Author)
                .WithMany(u => u.Comments);
            modelBuilder.Entity<Post>().OwnsMany(p => p.Days, p =>
            {
                p.HasKey("Id");
            });

            modelBuilder.Entity<Comment>(comment =>
            {
                // Comment to Post (only top-level comments are in Post.Comments)
                comment.HasOne(c => c.Post)
                       .WithMany(p => p.Comments)
                       .OnDelete(DeleteBehavior.Cascade);

                // Self-referential Comment hierarchy
                comment.HasOne(c => c.Parent)
                       .WithMany(c => c.Comments);
            });

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                // ON DELETE RESTRICT instead of ON DELETE CASCADE
                foreach (var key in entityType.GetForeignKeys())
                    key.DeleteBehavior = DeleteBehavior.Restrict;

                foreach (var prop in entityType.GetDeclaredProperties())
                {
                    // Define Guid as alternate key. The database can create a guid fou you.
                    if (prop.Name == "Guid")
                    {
                        modelBuilder.Entity(entityType.ClrType).HasAlternateKey("Guid");
                        prop.ValueGenerated = Microsoft
                            .EntityFrameworkCore
                            .Metadata
                            .ValueGenerated
                            .OnAdd;
                    }
                    // Default MaxLength of string Properties is 255.
                    if (prop.ClrType == typeof(string) && prop.GetMaxLength() is null)
                        prop.SetMaxLength(255);
                    // Seconds with 3 fractional digits.
                    if (prop.ClrType == typeof(DateTime))
                        prop.SetPrecision(3);
                    if (prop.ClrType == typeof(DateTime?))
                        prop.SetPrecision(3);
                }
            }
        }

        public void SeedDatabase()
        {
            Randomizer.Seed = new Random(11111111);
            var faker = new Faker("de");
            var users = new Faker<User>(locale: "de").CustomInstantiator(f =>
            {
                var username = f.Internet.UserName();
                return new User(username.ToLower(),
                                f.Internet.Email(),
                                f.Internet.Password(),
                                username,
                                f.Lorem.Sentence(20, 6),
                                f.Address.City(),
                                f.Address.County());
            }).Generate(5).ToList();

            var admin = new User("admin", "admin@triptales.at", "admin", "Administrator", "This is THE REAL Administrator Account.", "Spendergasse", "Vienna")
            {
                Verified = true
            };
            Users.Add(admin);
            Users.AddRange(users);
            SaveChanges();

            var posts = new Faker<Post>(locale: "de")
                .CustomInstantiator(f =>
                {
                    f.Lorem.Locale = "de";

                    var startDateTime = f.Date.Between(DateTime.UtcNow.AddDays(-20), DateTime.UtcNow.AddDays(-1));
                    var startDate = DateOnly.FromDateTime(startDateTime);
                    var endDateTime = f.Date.Between(startDateTime, DateTime.UtcNow);
                    var endDate = DateOnly.FromDateTime(endDateTime);

                    var numberOfDays = f.Random.Int(1, 5);
                    var days = new List<Post.Day>();

                    for (int i = 0; i < numberOfDays; i++)
                    {
                        var totalDaysDifference = endDate.DayNumber - startDate.DayNumber;
                        var dayOffset = i * (totalDaysDifference / Math.Max(1, numberOfDays - 1));
                        var dayDate = startDate.AddDays(dayOffset);

                        var day = new Post.Day(
                            title: f.Lorem.Sentence(5, 2),
                            description: f.Lorem.Sentence(25, 4),
                            date: dayDate
                        );

                        days.Add(day);
                    }

                    var post = new Post(
                        title: f.Lorem.Sentence(7, 2),
                        description: f.Lorem.Sentence(40, 5),
                        author: f.PickRandom(users),
                        startDate: startDate,
                        endDate: endDate,
                        days: days
                    );

                    List<Comment> GenerateComments(int maxDepth, Comment? parent = null, int currentDepth = 0, int genCount = 4)
                    {
                        var comments = new Faker<Comment>("de")
                            .CustomInstantiator(f =>
                            {
                                var comment = new Comment(
                                    content: f.Lorem.Sentence(5, 10),
                                    author: f.PickRandom(users),
                                    parent: parent,
                                    post: parent is null ? post : null
                                );

                                var likeCount = f.Random.Int(0, users.Count);
                                var randomUsers = users.OrderBy(_ => f.Random.Int()).Take(likeCount).ToList();
                                comment.Likes.AddRange(randomUsers);

                                if (currentDepth < maxDepth)
                                {
                                    var subCommentCount = f.Random.Int(0, 2);
                                    var subComments = GenerateComments(maxDepth, comment, currentDepth + 1, subCommentCount);
                                    comment.Comments.AddRange(subComments);
                                }

                                return comment;
                            })
                            .Generate(f.Random.Int(1, genCount))
                            .ToList();

                        return comments;
                    }

                    var likeCount = f.Random.Int(0, users.Count);
                    var randomUsers = users.OrderBy(_ => f.Random.Int()).Take(likeCount).ToList();
                    post.Likes.AddRange(randomUsers);

                    post.Comments.AddRange(GenerateComments(maxDepth: 3));
                    return post;
                })
                .Generate(10)
                .ToList();
            Posts.AddRange(posts);
            SaveChanges();
        }
    }
}
