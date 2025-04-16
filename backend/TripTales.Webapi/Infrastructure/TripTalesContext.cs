using System;
using System.Collections.Generic;
using System.Linq;
using Bogus;
using Microsoft.EntityFrameworkCore;
using Triptales.Application.Model;

namespace Triptales.Webapi.Infrastructure
{
    public class TripTalesContext : DbContext
    {
        public TripTalesContext(DbContextOptions<TripTalesContext> options)
            : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Post> Posts => Set<Post>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Post>().HasMany(p => p.Likes)
                .WithMany(u => u.LikedPosts)
                .UsingEntity(j => j.ToTable("PostLikes"));
            modelBuilder.Entity<Post.Comment>().HasMany(c => c.Likes)
                .WithMany(u => u.LikedComments)
                .UsingEntity(j => j.ToTable("CommentLikes"));
            modelBuilder.Entity<Post>().HasOne(p => p.Author)
                .WithMany(u => u.Posts);
            modelBuilder.Entity<Post>().OwnsMany(p => p.Days, p =>
            {
                p.HasKey("Id");
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
                        description: f.Lorem.Sentence(35, 5),
                        author: f.PickRandom(users),
                        startDate: startDate,
                        endDate: endDate,
                        days: days
                    );

                    return post;
                })
                .Generate(10)
                .ToList();
            Posts.AddRange(posts);
            SaveChanges();
        }
    }
}
